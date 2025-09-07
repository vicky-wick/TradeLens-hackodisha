# TradeLens 🎯

**The Duolingo of Crypto Trading**

TradeLens is a learning-first platform where users learn by predicting, compare their predictions with an ML mentor, and improve inside a social, gamified environment with risk-aware coaching and verifiable achievement badges.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/TradeLens-hackodisha.git
cd TradeLens-hackodisha

# Start local server
python -m http.server 8080

# Open in browser
http://localhost:8080
```

## ✨ What Makes TradeLens Special

- **Learn by Comparison**: First platform to compare user predictions with explainable AI
- **SHAP-Style Explanations**: AI mentor explains reasoning with feature importance
- **Social Learning**: Community feed with prediction sharing and discussion
- **Risk-Aware Coaching**: Trader Health Score and personalized risk assessments
- **Gamified Progress**: Badges, levels, and measurable skill improvement

## 🏗️ Architecture

- **Frontend**: Vanilla HTML/CSS/JavaScript (hackathon-optimized)
- **Data Storage**: LocalStorage for persistence
- **ML Service**: Mock AI responses with SHAP-style explanations
- **Styling**: Modern CSS with responsive design
- **Future**: React/Next.js, Node.js, Python/FastAPI, PostgreSQL

## 📚 Core Features (MVP)

### 🎓 Learning Hub
- Interactive RSI lesson with 3 cards + quiz
- Progress tracking and skill assessment
- Lesson context carries to prediction workspace

### 🎯 Prediction Workspace
- BTC 1h predictions with confidence levels
- Real-time price data and technical indicators
- Detailed rationale input for learning

### 🤖 ML Mentor
- AI predictions with confidence scores
- SHAP-style feature importance explanations
- Risk assessment with stop-loss suggestions
- Learning insights based on comparison

### 👥 Community Feed
- Share predictions with rationale
- Social learning and discussion
- Like, comment, and follow other traders

### 📊 Dashboard
- Trader Health Score tracking
- Learning progress visualization
- Prediction accuracy vs AI comparison
- Quick actions and recent activity

## 🎯 Demo Flow (5-7 minutes)

1. **Landing Page**: Show value proposition and signup
2. **Learning Hub**: Complete RSI lesson and quiz (92% score)
3. **Prediction Workspace**: Make BTC prediction with rationale
4. **AI Mentor**: Compare with AI explanation and SHAP analysis
5. **Community Feed**: Share prediction and view social learning

## 🛠️ Development

```bash
# Start local server
python -m http.server 8080

# Or use live-server for auto-reload
npx live-server --port=8080

# Or simply open index.html in your browser
```

## 📁 Project Structure

```
TradeLens-hackodisha/
├── index.html              # Landing page with auth
├── pages/                  # Application pages
│   ├── dashboard.html      # User dashboard & stats
│   ├── learning.html       # Interactive lessons
│   ├── prediction.html     # Prediction workspace
│   └── community.html      # Social feed
├── css/                    # Stylesheets
│   ├── main.css           # Core styles & layout
│   └── components.css     # UI components
├── js/                     # JavaScript modules
│   ├── app.js             # Main application logic
│   ├── storage.js         # LocalStorage management
│   ├── dashboard.js       # Dashboard functionality
│   ├── learning.js        # Learning hub logic
│   ├── prediction.js      # Prediction workspace
│   ├── community.js       # Community feed
│   └── ml-mentor.js       # Mock AI service
├── DEMO_SCRIPT.md         # Hackathon demo guide
├── PITCH_SLIDES.md        # 7-slide presentation
└── README.md              # This file
```

## 🎪 Hackathon Materials

- **Demo Script**: Complete 5-7 minute presentation flow with timing
- **Pitch Deck**: 7-slide presentation outline with key messages
- **Live Demo**: Fully functional learning→prediction→AI feedback loop

## 🚀 Future Roadmap

### Phase 1 (Post-Hackathon)
- Real ML models with live market data
- Mobile-responsive improvements
- User authentication system

### Phase 2 (3-6 months)
- Exchange API integration
- Advanced technical indicators
- NFT badge minting on Polygon

### Phase 3 (6-12 months)
- Mobile app development
- Expert mentor marketplace
- Advanced risk management tools

## 🎯 Key Metrics & Goals

- **Target Users**: 10K users in first 6 months
- **Learning Completion**: 85% lesson completion rate
- **Skill Improvement**: 12% average accuracy improvement vs baseline
- **Community Engagement**: 500+ daily predictions shared

## 🤝 Contributing

This is a hackathon project, but we welcome contributions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Contact

- **Team**: Power Rangers
- **Email**: vadhikari2023@gift.edu.in
- **Demo**: Available for live demonstration

---

**Built with ❤️ for crypto education and powered by explainable AI**

