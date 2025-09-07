# chatbot_module.py
import streamlit as st
from langgraph.graph import StateGraph, END, add_messages
from typing import TypedDict, Annotated
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
import os

# PDF + Vectorstore
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA

# ---------------- Setup ----------------
load_dotenv()
print("API Key Loaded:", os.getenv("GOOGLE_API_KEY"))

llm = ChatGoogleGenerativeAI(model="models/gemini-1.5-flash", temperature=0.1)


# -------- PDF Loader --------
def load_pdf(pdf_path):
    """Load a PDF and create a QA retriever"""
    try:
        loader = PyPDFLoader(pdf_path)
        documents = loader.load()

        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        vectorstore = FAISS.from_documents(documents, embeddings)
        retriever = vectorstore.as_retriever()

        qa = RetrievalQA.from_chain_type(
            llm=llm,
            retriever=retriever,
            chain_type="stuff"
        )
        return qa
    except Exception as e:
        print("Error loading PDF:", e)
        return None


# -------- Load PDF Once --------
pdf_qa = load_pdf(r"K:\GENAI\langgraph\SEND.pdf")


class ChatState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]


# -------- Helper: Check if PDF Answer is Valid --------
def is_valid_pdf_answer(answer: str) -> bool:
    if not answer or answer.strip() == "":
        return False
    bad_phrases = [
        "i am sorry",
        "i don’t know",
        "i don't know",
        "no information",
        "not enough information"
    ]
    answer_lower = answer.lower()
    return not any(p in answer_lower for p in bad_phrases)


# -------- Node --------
def chat_node(state: ChatState):
    global pdf_qa
    messages = state["messages"]
    user_msg = messages[-1].content

    final_answer = None
    source = None

    # --- Try PDF First ---
    if pdf_qa is not None:
        try:
            response = pdf_qa.run(user_msg)
            if is_valid_pdf_answer(response):
                final_answer = response
                source = "pdf"
        except Exception as e:
            print("PDF error:", e)

    # --- Fallback to LLM if no PDF answer ---
    if final_answer is None:
        try:
            response = llm.invoke([HumanMessage(content=user_msg)])
            final_answer = response.content
            source = "llm"
        except Exception as e:
            final_answer = f"⚠️ Error: {e}"
            source = "llm"

    return {"messages": messages + [AIMessage(content=final_answer, additional_kwargs={"source": source})]}


# -------- Build Graph --------
graph = StateGraph(ChatState)
graph.add_node("chatnode", chat_node)
graph.set_entry_point("chatnode")
graph.add_edge("chatnode", END)
chatbot = graph.compile()


# -------- UI Function --------
def chatbot_ui():
    st.header("💬 Your helpful Crypto Assistant")

    if "history" not in st.session_state:
        st.session_state.history = []

    history = st.session_state.history

    for msg in history:
        if isinstance(msg, HumanMessage):
            with st.chat_message("user"):
                st.markdown(msg.content)
        elif isinstance(msg, AIMessage):
            src = msg.additional_kwargs.get("source", "")
            with st.chat_message("assistant"):
                if src == "pdf":
                    st.markdown(f"📄 {msg.content}")
                elif src == "llm":
                    st.markdown(f"🤖 {msg.content}")
                else:
                    st.markdown(msg.content)

    user_input = st.chat_input("Ask Anything about Crypto...")

    if user_input:
        with st.chat_message("user"):
            st.markdown(user_input)

        initial_state = {"messages": history + [HumanMessage(content=user_input)]}
        response = chatbot.invoke(initial_state)

        bot_reply = response["messages"][-1]
        history.append(HumanMessage(content=user_input))
        history.append(bot_reply)

        with st.chat_message("assistant"):
            src = bot_reply.additional_kwargs.get("source", "")
            if src == "pdf":
                st.markdown(f"📄 {bot_reply.content}")
            elif src == "llm":
                st.markdown(f"🤖 {bot_reply.content}")
            else:
                st.markdown(bot_reply.content)

    # ---- Delete Buttons ----
    if st.sidebar.button("🗑️ Delete PDF Answers"):
        history[:] = [msg for msg in history if not (isinstance(msg, AIMessage) and msg.additional_kwargs.get("source") == "pdf")]
        st.rerun()

    if st.sidebar.button("🗑️ Delete LLM Answers"):
        history[:] = [msg for msg in history if not (isinstance(msg, AIMessage) and msg.additional_kwargs.get("source") == "llm")]
        st.rerun()

    if st.sidebar.button("🗑️ Clear All History"):
        st.session_state.history = []
        st.rerun()


if __name__ == "__main__":
    chatbot_ui()
