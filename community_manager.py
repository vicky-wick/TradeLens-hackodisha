#!/usr/bin/env python3
"""
TradeLens Community Data Manager - Pure Python File Handling
Directly reads from and writes to community-data.txt
"""

import os
from datetime import datetime
import re

class CommunityDataManager:
    def __init__(self, data_file='data/community-data.txt'):
        self.data_file = data_file
        self.posts = []
        self.stats = {}
        self.load_data()
    
    def load_data(self):
        """Load community data from text file"""
        if not os.path.exists(self.data_file):
            print(f"Data file {self.data_file} not found!")
            return
        
        with open(self.data_file, 'r', encoding='utf-8') as file:
            lines = file.readlines()
        
        self.posts = []
        for line in lines:
            line = line.strip()
            
            # Skip comments and empty lines
            if line.startswith('#') or not line:
                continue
                
            # Parse stats
            if line.startswith('STATS_'):
                key, value = line.split(':', 1)
                self.stats[key] = value
                continue
            
            # Parse post data: timestamp|userId|userName|cryptoSymbol|postType|content|prediction|confidence|likes|comments
            parts = line.split('|')
            if len(parts) >= 9:
                post = {
                    'timestamp': parts[0],
                    'userId': parts[1],
                    'userName': parts[2],
                    'cryptoSymbol': parts[3],
                    'postType': parts[4],
                    'content': parts[5],
                    'prediction': parts[6] if parts[6] != 'NEUTRAL' else 'NEUTRAL',
                    'confidence': int(parts[7]) if parts[7].isdigit() else 0,
                    'likes': int(parts[8]) if parts[8].isdigit() else 0,
                    'comments': int(parts[9]) if len(parts) > 9 and parts[9].isdigit() else 0
                }
                self.posts.append(post)
    
    def add_post(self, user_id, user_name, crypto_symbol, post_type, content, prediction='NEUTRAL', confidence=0):
        """Add a new post to the community"""
        timestamp = datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ')
        
        new_post = {
            'timestamp': timestamp,
            'userId': user_id,
            'userName': user_name,
            'cryptoSymbol': crypto_symbol,
            'postType': post_type,
            'content': content,
            'prediction': prediction,
            'confidence': confidence,
            'likes': 0,
            'comments': 0
        }
        
        self.posts.insert(0, new_post)  # Add to beginning (most recent first)
        self.save_data()
        print(f"✅ Post added by {user_name}")
        return new_post
    
    def like_post(self, post_index):
        """Add a like to a post"""
        if 0 <= post_index < len(self.posts):
            self.posts[post_index]['likes'] += 1
            self.save_data()
            print(f"👍 Post liked! Total likes: {self.posts[post_index]['likes']}")
            return True
        return False
    
    def add_comment(self, post_index):
        """Add a comment count to a post"""
        if 0 <= post_index < len(self.posts):
            self.posts[post_index]['comments'] += 1
            self.save_data()
            print(f"💬 Comment added! Total comments: {self.posts[post_index]['comments']}")
            return True
        return False
    
    def save_data(self):
        """Save all data back to the text file"""
        with open(self.data_file, 'w', encoding='utf-8') as file:
            # Write header
            file.write("# TradeLens Community Data Storage\n")
            file.write("# Format: timestamp|userId|userName|cryptoSymbol|postType|content|prediction|confidence|likes|comments\n")
            file.write("# Post Types: tweet, prediction, analysis, news, discussion\n\n")
            
            # Write posts
            for post in self.posts:
                line = f"{post['timestamp']}|{post['userId']}|{post['userName']}|{post['cryptoSymbol']}|{post['postType']}|{post['content']}|{post['prediction']}|{post['confidence']}|{post['likes']}|{post['comments']}\n"
                file.write(line)
            
            # Write trending topics
            file.write("\n# Trending Topics (updated hourly)\n")
            file.write("#TRENDING: #BitcoinETF #EthereumUpgrade #DeFiSummer #NFTMarket #Web3Gaming #CryptoRegulation #StablecoinNews #LayerTwoSolutions\n\n")
            
            # Write stats
            file.write("# Community Stats (updated daily)\n")
            file.write(f"STATS_ACTIVE_USERS:{len(set(post['userId'] for post in self.posts))}\n")
            file.write(f"STATS_DAILY_POSTS:{len(self.posts)}\n")
            
            # Calculate crypto post counts
            crypto_counts = {}
            for post in self.posts:
                crypto = post['cryptoSymbol']
                crypto_counts[crypto] = crypto_counts.get(crypto, 0) + 1
            
            file.write(f"STATS_PREDICTIONS_TODAY:{len([p for p in self.posts if p['postType'] == 'prediction'])}\n")
            file.write("STATS_ACCURACY_RATE:68\n")
            file.write("STATS_AI_COMPARISON:+12\n\n")
            
            file.write("# Crypto-specific engagement metrics\n")
            for crypto, count in crypto_counts.items():
                file.write(f"{crypto}_POSTS_TODAY:{count}\n")
    
    def display_posts(self, limit=5):
        """Display recent posts"""
        print(f"\n📱 Recent Community Posts (showing {min(limit, len(self.posts))}):")
        print("-" * 80)
        
        for i, post in enumerate(self.posts[:limit]):
            print(f"{i+1}. [{post['cryptoSymbol']}] {post['userName']} - {post['postType']}")
            print(f"   {post['content'][:100]}...")
            if post['prediction'] != 'NEUTRAL':
                print(f"   🎯 Prediction: {post['prediction']} ({post['confidence']}% confidence)")
            print(f"   👍 {post['likes']} likes | 💬 {post['comments']} comments")
            print(f"   🕒 {post['timestamp']}")
            print()
    
    def get_crypto_stats(self):
        """Get statistics by cryptocurrency"""
        crypto_stats = {}
        for post in self.posts:
            crypto = post['cryptoSymbol']
            if crypto not in crypto_stats:
                crypto_stats[crypto] = {'posts': 0, 'likes': 0, 'predictions': 0}
            
            crypto_stats[crypto]['posts'] += 1
            crypto_stats[crypto]['likes'] += post['likes']
            if post['postType'] == 'prediction':
                crypto_stats[crypto]['predictions'] += 1
        
        return crypto_stats

def main():
    """Command line interface for community management"""
    manager = CommunityDataManager()
    
    while True:
        print("\n🚀 TradeLens Community Manager")
        print("1. View recent posts")
        print("2. Add new post")
        print("3. Like a post")
        print("4. Add comment to post")
        print("5. View crypto statistics")
        print("6. Exit")
        
        choice = input("\nEnter your choice (1-6): ").strip()
        
        if choice == '1':
            limit = input("How many posts to show? (default 5): ").strip()
            limit = int(limit) if limit.isdigit() else 5
            manager.display_posts(limit)
        
        elif choice == '2':
            print("\n📝 Add New Post:")
            user_id = input("User ID: ").strip()
            user_name = input("Username: ").strip()
            crypto = input("Crypto Symbol (BTC/ETH/ADA/SOL/etc): ").strip().upper()
            post_type = input("Post Type (tweet/prediction/analysis/discussion/news): ").strip().lower()
            content = input("Content: ").strip()
            
            prediction = 'NEUTRAL'
            confidence = 0
            if post_type == 'prediction':
                prediction = input("Prediction (UP/DOWN/FLAT): ").strip().upper()
                conf_input = input("Confidence % (0-100): ").strip()
                confidence = int(conf_input) if conf_input.isdigit() else 0
            
            manager.add_post(user_id, user_name, crypto, post_type, content, prediction, confidence)
        
        elif choice == '3':
            manager.display_posts(10)
            post_num = input("Which post to like? (enter number): ").strip()
            if post_num.isdigit():
                manager.like_post(int(post_num) - 1)
        
        elif choice == '4':
            manager.display_posts(10)
            post_num = input("Which post to comment on? (enter number): ").strip()
            if post_num.isdigit():
                manager.add_comment(int(post_num) - 1)
        
        elif choice == '5':
            stats = manager.get_crypto_stats()
            print("\n📊 Crypto Statistics:")
            print("-" * 50)
            for crypto, data in stats.items():
                print(f"{crypto}: {data['posts']} posts, {data['likes']} total likes, {data['predictions']} predictions")
        
        elif choice == '6':
            print("👋 Goodbye!")
            break
        
        else:
            print("❌ Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
