// TradeLens ML Mentor - Mock AI Service

// Mock ML model responses with SHAP-style explanations
const MLMentor = {
    // Simulate ML prediction based on current market conditions
    generatePrediction: function(asset, timeframe, currentRSI = 78, volume = 'declining') {
        // Mock prediction logic based on technical indicators
        const predictions = {
            'BTC-1h-high-rsi': {
                direction: 'DOWN',
                confidence: 72,
                reasoning: 'High RSI (78) combined with declining volume suggests weakening momentum and potential reversal',
                features: [
                    { name: 'RSI Level', value: 78, importance: 0.35, impact: 'negative' },
                    { name: 'Volume Trend', value: 'declining', importance: 0.28, impact: 'negative' },
                    { name: 'Price Momentum', value: 'bullish', importance: 0.20, impact: 'positive' },
                    { name: 'Market Sentiment', value: 'neutral', importance: 0.17, impact: 'neutral' }
                ],
                riskLevel: 'Medium-High',
                stopLoss: '$41,800',
                takeProfit: '$40,500'
            },
            'BTC-1h-normal-rsi': {
                direction: 'UP',
                confidence: 65,
                reasoning: 'Moderate RSI with increasing volume supports continued upward movement',
                features: [
                    { name: 'Volume Trend', value: 'increasing', importance: 0.32, impact: 'positive' },
                    { name: 'RSI Level', value: 45, importance: 0.25, impact: 'positive' },
                    { name: 'Price Momentum', value: 'bullish', importance: 0.23, impact: 'positive' },
                    { name: 'Support Level', value: 'strong', importance: 0.20, impact: 'positive' }
                ],
                riskLevel: 'Medium',
                stopLoss: '$42,100',
                takeProfit: '$44,800'
            },
            'ETH-1h': {
                direction: 'UP',
                confidence: 58,
                reasoning: 'ETH showing relative strength against BTC with healthy volume',
                features: [
                    { name: 'ETH/BTC Ratio', value: 'strengthening', importance: 0.30, impact: 'positive' },
                    { name: 'Volume Profile', value: 'healthy', importance: 0.25, impact: 'positive' },
                    { name: 'RSI Level', value: 52, importance: 0.25, impact: 'neutral' },
                    { name: 'Market Structure', value: 'bullish', importance: 0.20, impact: 'positive' }
                ],
                riskLevel: 'Medium',
                stopLoss: '$2,680',
                takeProfit: '$2,820'
            }
        };
        
        // Select appropriate prediction based on conditions
        let key = `${asset}-${timeframe}`;
        if (asset === 'BTC' && currentRSI > 70) {
            key = 'BTC-1h-high-rsi';
        } else if (asset === 'BTC') {
            key = 'BTC-1h-normal-rsi';
        } else if (asset === 'ETH') {
            key = 'ETH-1h';
        }
        
        return predictions[key] || predictions['BTC-1h-normal-rsi'];
    },

    // Generate detailed explanation with SHAP-style feature analysis
    generateExplanation: function(prediction) {
        const explanations = {
            'DOWN': [
                "The AI model predicts a downward movement based on several key technical indicators.",
                "The high RSI reading suggests the asset is overbought, which historically leads to price corrections.",
                "Declining volume during the recent price rise indicates weakening buyer interest.",
                "The combination of these factors creates a high probability scenario for a short-term reversal."
            ],
            'UP': [
                "The AI model identifies bullish momentum based on technical analysis.",
                "Volume patterns support the current price direction, indicating strong market participation.",
                "RSI levels remain in healthy territory, suggesting room for further upward movement.",
                "Market structure and support levels provide a favorable risk-reward setup."
            ],
            'FLAT': [
                "The AI model expects sideways movement due to conflicting signals.",
                "Technical indicators show mixed signals with no clear directional bias.",
                "Current price level represents a key decision point for market participants.",
                "Range-bound trading is likely until a clear catalyst emerges."
            ]
        };
        
        return explanations[prediction.direction] || explanations['FLAT'];
    },

    // Generate risk assessment and recommendations
    generateRiskAssessment: function(prediction, userPrediction) {
        const agreement = prediction.direction === userPrediction.direction;
        const confidenceDiff = Math.abs(prediction.confidence - userPrediction.confidence);
        
        let riskLevel = 'Medium';
        let recommendations = [];
        
        if (agreement && confidenceDiff < 20) {
            riskLevel = 'Low';
            recommendations = [
                "Your prediction aligns well with the AI analysis",
                "Consider a standard position size for this setup",
                "Monitor volume for confirmation of the move"
            ];
        } else if (agreement && confidenceDiff >= 20) {
            riskLevel = 'Medium';
            recommendations = [
                "Direction matches but confidence levels differ",
                "Consider adjusting position size based on your confidence",
                "Review the factors that led to your confidence level"
            ];
        } else {
            riskLevel = 'High';
            recommendations = [
                "Your prediction differs from AI analysis - proceed with caution",
                "Consider reducing position size or waiting for more confirmation",
                "Review the AI's reasoning and reassess your analysis"
            ];
        }
        
        return {
            level: riskLevel,
            recommendations: recommendations,
            stopLoss: prediction.stopLoss,
            takeProfit: prediction.takeProfit,
            traderHealthImpact: agreement ? '+2' : '-1'
        };
    },

    // Calculate learning insights based on prediction comparison
    generateLearningInsights: function(userPrediction, aiPrediction) {
        const insights = [];
        
        // Check RSI understanding
        if (userPrediction.rationale.toLowerCase().includes('rsi')) {
            if (aiPrediction.features.find(f => f.name === 'RSI Level' && f.importance > 0.3)) {
                insights.push({
                    type: 'success',
                    message: "Great job considering RSI! It's a key factor in this prediction.",
                    skill: 'RSI Analysis'
                });
            }
        } else if (aiPrediction.features.find(f => f.name === 'RSI Level' && f.importance > 0.3)) {
            insights.push({
                type: 'improvement',
                message: "Consider RSI levels in your analysis - it's showing strong signals here.",
                skill: 'RSI Analysis',
                suggestion: "Review the RSI lesson to strengthen this skill"
            });
        }
        
        // Check volume analysis
        if (userPrediction.rationale.toLowerCase().includes('volume')) {
            insights.push({
                type: 'success',
                message: "Excellent volume analysis! This is crucial for confirming price movements.",
                skill: 'Volume Analysis'
            });
        } else if (aiPrediction.features.find(f => f.name.includes('Volume') && f.importance > 0.25)) {
            insights.push({
                type: 'improvement',
                message: "Volume is a key factor here. Consider incorporating volume analysis.",
                skill: 'Volume Analysis',
                suggestion: "Take the Volume Analysis lesson to improve this skill"
            });
        }
        
        // Overall prediction accuracy insight
        if (userPrediction.direction === aiPrediction.direction) {
            insights.push({
                type: 'success',
                message: "Your directional prediction matches the AI! Well done.",
                skill: 'Market Direction'
            });
        } else {
            insights.push({
                type: 'learning',
                message: "Different prediction from AI - great learning opportunity!",
                skill: 'Market Analysis',
                suggestion: "Review the AI's reasoning to understand alternative perspectives"
            });
        }
        
        return insights;
    },

    // Simulate real-time price updates
    getCurrentPrice: function(asset) {
        const basePrices = {
            'BTC': 43250,
            'ETH': 2750,
            'ADA': 0.45
        };
        
        const basePrice = basePrices[asset] || basePrices['BTC'];
        const volatility = 0.02; // 2% volatility
        const change = (Math.random() - 0.5) * 2 * volatility;
        
        return {
            price: basePrice * (1 + change),
            change: change * 100,
            timestamp: new Date().toISOString()
        };
    },

    // Generate market sentiment data
    getMarketSentiment: function(asset) {
        const sentiments = ['Bullish', 'Bearish', 'Neutral', 'Cautiously Optimistic', 'Uncertain'];
        const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
        
        return {
            overall: sentiment,
            fearGreedIndex: Math.floor(Math.random() * 100),
            socialMentiment: Math.floor(Math.random() * 100),
            institutionalFlow: Math.random() > 0.5 ? 'Inflow' : 'Outflow'
        };
    }
};

// Export for use in other files
window.MLMentor = MLMentor;
