import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Paper, Container, Grid, CircularProgress, Alert, LinearProgress, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { BarChart, TrendingUp, Star } from '@mui/icons-material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AnalyticsPage = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState(30);
  
  const [overallSatisfaction, setOverallSatisfaction] = useState(0);
  const [languageData, setLanguageData] = useState([]);
  const [coreMetrics, setCoreMetrics] = useState([]);
  const [emergingTrends, setEmergingTrends] = useState([]);

  useEffect(() => {
    const fetchBusinessIdAndAnalytics = async () => {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        setError("Please log in to view analytics.");
        setLoading(false);
        return;
      }

      try {
        const businessQuery = query(collection(db, "business_links"), where("userId", "==", user.uid));
        const businessSnapshot = await getDocs(businessQuery);

        if (businessSnapshot.empty) {
          setError("Could not find your business record.");
          setLoading(false);
          return;
        }
        
        const businessDoc = businessSnapshot.docs[0];
        const businessData = businessDoc.data();
        const currentCoreKeywords = businessData.highlightTabs || [];

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - timeRange);
        const startTimestamp = Timestamp.fromDate(startDate);
        
        const reviewsQuery = query(
          collection(db, "reviews"), 
          where("businessId", "==", businessDoc.id),
          where("createdAt", ">=", startTimestamp)
        );
        const reviewsSnapshot = await getDocs(reviewsQuery);
        
        let totalSatisfaction = 0;
        const languageCounts = {};
        const keywordStats = {};
        const keywordTrendData = {};

        reviewsSnapshot.forEach(doc => {
          const review = doc.data();
          totalSatisfaction += review.overallExperience;
          languageCounts[review.language] = (languageCounts[review.language] || 0) + 1;
          
          const reviewDate = review.createdAt.toDate().toISOString().split('T')[0];

          if (review.keywordRatings) {
            for (const [keyword, rating] of Object.entries(review.keywordRatings)) {
              if (!keywordStats[keyword]) {
                keywordStats[keyword] = { totalRating: 0, count: 0 };
                keywordTrendData[keyword] = {};
              }
              keywordStats[keyword].totalRating += rating;
              keywordStats[keyword].count++;
              
              if (!keywordTrendData[keyword][reviewDate]) {
                keywordTrendData[keyword][reviewDate] = { total: 0, count: 0 };
              }
              keywordTrendData[keyword][reviewDate].total += rating;
              keywordTrendData[keyword][reviewDate].count++;
            }
          }
        });

        const numReviews = reviewsSnapshot.size;
        setOverallSatisfaction(numReviews > 0 ? parseFloat((totalSatisfaction / numReviews).toFixed(1)) : 0);
        
        const formattedLanguageData = Object.entries(languageCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
        setLanguageData(formattedLanguageData);
        
        const coreMetricsData = currentCoreKeywords.map(keyword => {
          const trendData = keywordTrendData[keyword] ? Object.entries(keywordTrendData[keyword]).map(([date, data]) => ({
            date,
            rating: parseFloat((data.total / data.count).toFixed(1))
          })).sort((a, b) => new Date(a.date) - new Date(b.date)) : [];
          
          return {
            name: keyword,
            averageRating: keywordStats[keyword] ? parseFloat((keywordStats[keyword].totalRating / keywordStats[keyword].count).toFixed(1)) : 0,
            mentions: keywordStats[keyword] ? keywordStats[keyword].count : 0,
            trendData
          };
        });

        const emergingTrendsData = Object.entries(keywordStats).filter(([keyword]) => !currentCoreKeywords.includes(keyword) && keywordStats[keyword].count >= 3).map(([keyword, stats]) => ({
          name: keyword,
          averageRating: parseFloat((stats.totalRating / stats.count).toFixed(1)),
          mentions: stats.count
        })).sort((a,b) => b.mentions - a.mentions);
        
        setCoreMetrics(coreMetricsData);
        setEmergingTrends(emergingTrendsData);

      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError("Could not load analytics data.");
      }
      setLoading(false);
    };
    fetchBusinessIdAndAnalytics();
  }, [timeRange]);

  const handleTabChange = (event, newValue) => setCurrentTab(newValue);
  const handleTimeRangeChange = (event, newRange) => {
    if (newRange !== null) {
      setTimeRange(newRange);
    }
  };

  const renderOverview = () => (
     <Grid container spacing={3} p={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
            <Typography variant="h6">Overall Satisfaction Score</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 2 }}>
                <Typography variant="h2" component="p" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {overallSatisfaction}
                </Typography>
                <Star sx={{ fontSize: 40, color: 'gold', ml: 1 }} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" align="center">Reviews by Language</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={languageData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
  );

  const renderKeywords = () => (
    <Box p={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Core Metrics</Typography>
        <ToggleButtonGroup value={timeRange} exclusive onChange={handleTimeRangeChange}>
          <ToggleButton value={7}>7 Days</ToggleButton>
          <ToggleButton value={30}>30 Days</ToggleButton>
          <ToggleButton value={90}>90 Days</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      {coreMetrics.length > 0 ? (
        <Grid container spacing={3}>
          {coreMetrics.map(metric => (
            <Grid item xs={12} md={6} key={metric.name}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">{metric.name}</Typography>
                  <Typography variant="h4" color="primary.main">{metric.averageRating} <Typography component="span" variant="h6" color="text.secondary">/ 5</Typography></Typography>
                </Box>
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart data={metric.trendData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                    <YAxis domain={[1, 5]} hide />
                    <Line type="monotone" dataKey="rating" stroke="#8884d8" strokeWidth={2} dot={false} />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert severity="info">No data for Core Metrics in the selected time range.</Alert>
      )}

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Emerging Trends</Typography>
      <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
        Keywords added by customers, mentioned 3+ times in the last {timeRange} days.
      </Typography>

      {emergingTrends.length > 0 ? (
         <Paper sx={{p: 2}}>
           {emergingTrends.map(trend => (
              <Box key={trend.name} sx={{mb: 2}}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body1">{trend.name}</Typography>
                    <Typography variant="body1" color="text.secondary">{trend.averageRating}/5</Typography>
                </Box>
                <LinearProgress variant="determinate" value={(trend.averageRating / 5) * 100} />
                <Typography variant="caption" color="text.secondary">{trend.mentions} mention(s)</Typography>
              </Box>
           ))}
         </Paper>
      ) : (
         <Typography>No significant emerging trends found yet.</Typography>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Analytics Dashboard
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error" sx={{mt: 2}}>{error}</Alert>
      ) : (
        <Paper>
          <Tabs value={currentTab} onChange={handleTabChange} variant="fullWidth">
            <Tab icon={<TrendingUp />} label="Overview" />
            <Tab icon={<BarChart />} label="Keywords" />
          </Tabs>

          {currentTab === 0 && renderOverview()}
          {currentTab === 1 && renderKeywords()}
        </Paper>
      )}
    </Container>
  );
};

export default AnalyticsPage;