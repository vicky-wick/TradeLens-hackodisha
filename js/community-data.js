// TradeLens Community Data Management
class CommunityDataManager {
    constructor() {
        this.posts = [];
        this.currentCrypto = 'ALL';
        this.currentFilter = 'all';
        this.currentSort = 'recent';
        this.currentTrend = null;
        this.dataLoaded = false;
    }

    async initialize() {
        await this.loadCommunityData();
        this.dataLoaded = true;
        return this;
    }

    // Load community data from text file or localStorage
    async loadCommunityData() {
        // Try to load from text file first
        try {
            const response = await fetch('../data/community-data.txt');
            if (response.ok) {
                const textData = await response.text();
                this.posts = this.parseTextFile(textData);
                this.savePosts(); // Save to localStorage as backup
                return;
            }
        } catch (error) {
            console.log('Could not load from text file, using localStorage or sample data');
        }

        // Fallback to localStorage or sample data
        const localStoragePosts = localStorage.getItem('tradeLensCommunityPosts');
        if (localStoragePosts) {
            this.posts = JSON.parse(localStoragePosts);
            return;
        }

        // Use sample data as last resort
        const samplePosts = [
            {
                id: 'post001',
                userId: 'user001',
                userName: 'CryptoTrader_Alex',
                userBadge: 'expert',
                cryptoSymbol: 'BTC',
                postType: 'prediction',
                content: 'Just analyzed BTC charts and seeing strong bullish signals. RSI oversold, MACD crossing positive. Expecting breakout above $45k resistance.',
                prediction: 'UP',
                confidence: 85,
                likes: 12,
                comments: [
                    { userId: 'user020', userName: 'ChartReader', content: 'Great analysis! I see the same patterns.', createdAt: '2024-01-15T10:35:00Z' },
                    { userId: 'user021', userName: 'BearishBob', content: 'Disagree, resistance at 45k is too strong', createdAt: '2024-01-15T10:40:00Z' }
                ],
                likedBy: ['user002', 'user003'],
                createdAt: '2024-01-15T10:30:00Z',
                tags: ['BTC', 'TechnicalAnalysis', 'Bullish']
            },
            {
                id: 'post002',
                userId: 'user002',
                userName: 'BlockchainBeth',
                userBadge: 'verified',
                cryptoSymbol: 'ETH',
                postType: 'analysis',
                content: 'Ethereum\'s upcoming Shanghai upgrade could be a game changer. Staking withdrawals will provide more liquidity but also test market sentiment.',
                prediction: 'NEUTRAL',
                confidence: 70,
                likes: 8,
                comments: [
                    { userId: 'user022', userName: 'StakingSteve', content: 'Been waiting for this upgrade!', createdAt: '2024-01-15T09:50:00Z' }
                ],
                likedBy: ['user001'],
                createdAt: '2024-01-15T09:45:00Z',
                tags: ['ETH', 'EthereumUpgrade', 'Staking']
            },
            {
                id: 'post003',
                userId: 'user003',
                userName: 'AltcoinAndy',
                userBadge: 'trader',
                cryptoSymbol: 'ADA',
                postType: 'tweet',
                content: 'Cardano\'s development activity is through the roof! Smart contracts ecosystem growing rapidly. Bullish on long-term fundamentals.',
                prediction: 'UP',
                confidence: 78,
                likes: 15,
                comments: [],
                likedBy: ['user001', 'user002', 'user004'],
                createdAt: '2024-01-15T08:20:00Z',
                tags: ['ADA', 'Development', 'SmartContracts']
            },
            {
                id: 'post004',
                userId: 'user004',
                userName: 'DeFi_Dave',
                userBadge: 'analyst',
                cryptoSymbol: 'BTC',
                postType: 'discussion',
                content: 'Anyone else noticing the correlation between Bitcoin and traditional markets weakening? Could be sign of crypto maturing as asset class.',
                prediction: 'NEUTRAL',
                confidence: 65,
                likes: 20,
                comments: [
                    { userId: 'user023', userName: 'MacroMike', content: 'Yes! Decoupling is happening slowly', createdAt: '2024-01-15T07:20:00Z' },
                    { userId: 'user024', userName: 'TradFiTom', content: 'Still see correlation during major market events', createdAt: '2024-01-15T07:25:00Z' }
                ],
                likedBy: ['user001', 'user005'],
                createdAt: '2024-01-15T07:15:00Z',
                tags: ['BTC', 'MarketCorrelation', 'Institutional']
            },
            {
                id: 'post005',
                userId: 'user005',
                userName: 'TechAnalyst_Sam',
                userBadge: 'expert',
                cryptoSymbol: 'ETH',
                postType: 'prediction',
                content: 'ETH/BTC ratio looking strong. Expecting ETH to outperform BTC in the next 2 weeks. Target: 0.075 BTC per ETH.',
                prediction: 'UP',
                confidence: 82,
                likes: 18,
                comments: [],
                likedBy: ['user002', 'user003', 'user006'],
                createdAt: '2024-01-14T22:30:00Z',
                tags: ['ETH', 'BTC', 'Ratio', 'Outperformance']
            },
            {
                id: 'post006',
                userId: 'user006',
                userName: 'HODLer_Jane',
                userBadge: 'diamond',
                cryptoSymbol: 'BTC',
                postType: 'tweet',
                content: 'Dollar cost averaging into Bitcoin for 3 years now. Best decision I ever made. Patience pays off in crypto! 💎🙌',
                prediction: 'UP',
                confidence: 90,
                likes: 25,
                comments: [
                    { userId: 'user025', userName: 'NewbieTom', content: 'Inspiring! Just started DCA myself', createdAt: '2024-01-14T20:50:00Z' }
                ],
                likedBy: ['user001', 'user003', 'user007'],
                createdAt: '2024-01-14T20:45:00Z',
                tags: ['BTC', 'DCA', 'HODL', 'LongTerm']
            },
            {
                id: 'post007',
                userId: 'user007',
                userName: 'ChartMaster_Pro',
                userBadge: 'expert',
                cryptoSymbol: 'SOL',
                postType: 'analysis',
                content: 'Solana network performance has been impressive lately. 400ms block times and low fees making it attractive for DeFi apps.',
                prediction: 'UP',
                confidence: 75,
                likes: 10,
                comments: [],
                likedBy: ['user008'],
                createdAt: '2024-01-14T18:20:00Z',
                tags: ['SOL', 'Performance', 'DeFi', 'BlockTime']
            },
            {
                id: 'post008',
                userId: 'user008',
                userName: 'CryptoNewbie_01',
                userBadge: 'learner',
                cryptoSymbol: 'BTC',
                postType: 'discussion',
                content: 'New to crypto trading. Any advice on risk management? Hearing a lot about position sizing and stop losses.',
                prediction: 'NEUTRAL',
                confidence: 50,
                likes: 30,
                comments: [
                    { userId: 'user026', userName: 'RiskGuru', content: 'Never risk more than 2% per trade!', createdAt: '2024-01-14T16:35:00Z' },
                    { userId: 'user027', userName: 'SafeTrader', content: 'Start small, learn the basics first', createdAt: '2024-01-14T16:40:00Z' }
                ],
                likedBy: ['user001', 'user002', 'user009'],
                createdAt: '2024-01-14T16:30:00Z',
                tags: ['Education', 'RiskManagement', 'Beginner']
            }
        ];

        // Save sample data
        this.posts = samplePosts;
        this.savePosts();
    }

    // Parse text file format into JavaScript objects
    parseTextFile(textData) {
        const lines = textData.split('\n');
        const posts = [];
        
        for (const line of lines) {
            if (line.startsWith('#') || line.trim() === '' || line.startsWith('STATS_')) {
                continue; // Skip comments and stats
            }
            
            const parts = line.split('|');
            if (parts.length >= 9) {
                const post = {
                    id: this.generateId(),
                    userId: parts[1],
                    userName: parts[2],
                    userBadge: this.getUserBadge(parts[2]),
                    cryptoSymbol: parts[3],
                    postType: parts[4],
                    content: parts[5],
                    prediction: parts[6] !== 'NEUTRAL' ? parts[6] : null,
                    confidence: parseInt(parts[7]) || 0,
                    likes: parseInt(parts[8]) || 0,
                    comments: [],
                    likedBy: [],
                    createdAt: parts[0],
                    tags: this.extractHashtags(parts[5])
                };
                posts.push(post);
            }
        }
        
        return posts;
    }

    // Get user badge based on username
    getUserBadge(userName) {
        const badges = {
            'CryptoTrader_Alex': 'expert',
            'BlockchainBeth': 'verified',
            'TechAnalyst_Sam': 'expert',
            'ChartMaster_Pro': 'expert',
            'InstitutionalInvestor': 'verified',
            'CryptoEducator': 'expert',
            'HODLer_Jane': 'diamond',
            'CryptoNewbie_01': 'learner'
        };
        return badges[userName] || 'trader';
    }

    // Extract hashtags from content
    extractHashtags(content) {
        const hashtagRegex = /#[\w]+/g;
        const matches = content.match(hashtagRegex);
        return matches ? matches.map(tag => tag.substring(1)) : [];
    }

    // Save posts to localStorage
    savePosts() {
        localStorage.setItem('tradeLensCommunityPosts', JSON.stringify(this.posts));
    }

    // Get filtered posts based on current filters
    getFilteredPosts() {
        let filteredPosts = [...this.posts];

        // Filter by crypto
        if (this.currentCrypto !== 'ALL') {
            filteredPosts = filteredPosts.filter(post => post.cryptoSymbol === this.currentCrypto);
        }

        // Filter by post type
        if (this.currentFilter !== 'all') {
            filteredPosts = filteredPosts.filter(post => {
                switch (this.currentFilter) {
                    case 'predictions':
                        return post.postType === 'prediction';
                    case 'analysis':
                        return post.postType === 'analysis';
                    case 'discussion':
                        return post.postType === 'discussion';
                    case 'news':
                        return post.postType === 'news';
                    default:
                        return true;
                }
            });
        }

        // Filter by trending topic
        if (this.currentTrend) {
            filteredPosts = filteredPosts.filter(post => 
                post.tags && post.tags.some(tag => 
                    tag.toLowerCase().includes(this.currentTrend.toLowerCase())
                )
            );
        }

        // Sort posts
        return this.sortPosts(filteredPosts);
    }

    // Sort posts based on current sort option
    sortPosts(posts) {
        switch (this.currentSort) {
            case 'popular':
                return posts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
            case 'accurate':
                return posts.filter(p => p.postType === 'prediction')
                           .sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
            case 'engagement':
                return posts.sort((a, b) => {
                    const aEngagement = (a.likes || 0) + (a.comments ? a.comments.length : 0);
                    const bEngagement = (b.likes || 0) + (b.comments ? b.comments.length : 0);
                    return bEngagement - aEngagement;
                });
            default: // recent
                return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    }

    // Add new post
    addPost(postData) {
        const newPost = {
            id: this.generateId(),
            userId: postData.userId,
            userName: postData.userName,
            userBadge: postData.userBadge || 'trader',
            cryptoSymbol: postData.cryptoSymbol || 'BTC',
            postType: postData.postType || 'tweet',
            content: postData.content,
            prediction: postData.prediction,
            confidence: postData.confidence,
            likes: 0,
            comments: [],
            likedBy: [],
            createdAt: new Date().toISOString(),
            tags: postData.tags || []
        };

        this.posts.unshift(newPost);
        this.savePosts();
        return newPost;
    }

    // Toggle like on post
    toggleLike(postId, userId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return null;

        if (!post.likedBy) post.likedBy = [];
        
        const likeIndex = post.likedBy.indexOf(userId);
        if (likeIndex > -1) {
            post.likedBy.splice(likeIndex, 1);
            post.likes = Math.max(0, (post.likes || 0) - 1);
        } else {
            post.likedBy.push(userId);
            post.likes = (post.likes || 0) + 1;
        }

        this.savePosts();
        return post;
    }

    // Add comment to post
    addComment(postId, comment) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return null;

        if (!post.comments) post.comments = [];
        
        const newComment = {
            ...comment,
            id: this.generateId(),
            createdAt: new Date().toISOString()
        };

        post.comments.push(newComment);
        this.savePosts();
        return post;
    }

    // Get crypto-specific post counts
    getCryptoPostCounts() {
        const counts = {
            ALL: this.posts.length,
            BTC: 0,
            ETH: 0,
            ADA: 0,
            SOL: 0,
            DOT: 0,
            MATIC: 0,
            LINK: 0,
            DOGE: 0
        };

        this.posts.forEach(post => {
            if (counts.hasOwnProperty(post.cryptoSymbol)) {
                counts[post.cryptoSymbol]++;
            }
        });

        return counts;
    }

    // Generate unique ID
    generateId() {
        return 'post_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Get user badge icon
    getBadgeIcon(badge) {
        const badges = {
            expert: 'fas fa-star',
            verified: 'fas fa-check-circle',
            trader: 'fas fa-chart-line',
            analyst: 'fas fa-brain',
            diamond: 'fas fa-gem',
            learner: 'fas fa-graduation-cap'
        };
        return badges[badge] || 'fas fa-user';
    }

    // Get crypto icon
    getCryptoIcon(symbol) {
        const icons = {
            BTC: 'fab fa-bitcoin',
            ETH: 'fab fa-ethereum',
            ADA: 'fas fa-coins',
            SOL: 'fas fa-sun',
            DOT: 'fas fa-circle',
            MATIC: 'fas fa-polygon',
            LINK: 'fas fa-link',
            DOGE: 'fas fa-dog'
        };
        return icons[symbol] || 'fas fa-coins';
    }
}

// Export for use in community.js
window.CommunityDataManager = CommunityDataManager;
