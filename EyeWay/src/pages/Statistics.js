import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Platform,
  useWindowDimensions,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { LineChart, BarChart } from "react-native-chart-kit";
import Navbar from '../components/Navbar';
import axios from 'axios';

export default function Statistics({ navigation }) {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const API_URL = Platform.OS === 'android' ? "http://10.0.2.2:3000" : "http://localhost:3000";
  const sidebarWidth = 190; 
  const contentPadding = 20;
  const contentWidth = isWeb 
    ? Math.min(1200, width - sidebarWidth - (contentPadding * 2))
    : width - (contentPadding * 2);

  const [activeTab, setActiveTab] = useState('infractions');
  const [loading, setLoading] = useState(true);
  const [infractionStats, setInfractionStats] = useState({
    totalInfractions: '0',
    dailyAverage: '0',
    mostCommonType: 'N/A',
    mostCommonVehicle: 'N/A'
  });
  const [objectStats, setObjectStats] = useState({
    totalObjects: '0',
    dailyAverage: '0',
    mostCommonObject: 'N/A',
    activeLocations: '0'
  });

  const [hourlyData, setHourlyData] = useState({
    labels: Array.from({ length: 24 }, (_, i) => `${i}h`),
    datasets: [{ data: Array(24).fill(0) }]
  });

  const [locationStats, setLocationStats] = useState({
    labels: [],
    datasets: [{ data: [] }]
  });

  useEffect(() => {
    fetchAllStats();
  }, [activeTab]);

  const fetchAllStats = async () => {
    try {
      setLoading(true);
      if (activeTab === 'infractions') {
        const [summaryRes, hourlyRes, locationRes] = await Promise.all([
          axios.get(API_URL + '/statistics/summary'),
          axios.get(API_URL + '/statistics/hourly-by-location'),
          axios.get(API_URL + '/statistics/by-location')
        ]);

        setInfractionStats(summaryRes.data);
        processHourlyData(hourlyRes.data);
        processLocationData(locationRes.data);
      } else {
        const [summaryRes, hourlyRes, typesRes] = await Promise.all([
          axios.get(API_URL + '/object-stats/summary'),
          axios.get(API_URL + '/object-stats/hourly'),
          axios.get(API_URL + '/object-stats/types-by-location')
        ]);

        setObjectStats(summaryRes.data);
        processHourlyData(hourlyRes.data);
        processObjectTypeData(typesRes.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setLoading(false);
    }
  };

  const processHourlyData = (data) => {
    const locations = Object.keys(data);
    if (locations.length === 0) return;

    const combinedData = Array(24).fill(0);
    locations.forEach(location => {
      data[location].forEach((count, hour) => {
        combinedData[hour] += count;
      });
    });

    setHourlyData({
      labels: Array.from({ length: 24 }, (_, i) => `${i}h`),
      datasets: [{ data: combinedData }]
    });
  };

  const processLocationData = (data) => {
    setLocationStats({
      labels: data.map(loc => loc.location.substring(0, 15)),
      datasets: [{
        data: data.map(loc => loc.infraction_count)
      }]
    });
  };

  const processObjectTypeData = (data) => {
    const locations = Object.keys(data);
    const combinedCounts = {};
    
    locations.forEach(location => {
      data[location].forEach(item => {
        combinedCounts[item.class_label] = (combinedCounts[item.class_label] || 0) + item.count;
      });
    });

    const sortedTypes = Object.entries(combinedCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    setLocationStats({
      labels: sortedTypes.map(([label]) => label),
      datasets: [{
        data: sortedTypes.map(([,count]) => count)
      }]
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Carregando estatísticas...</Text>
      </View>
    );
  }

  const chartConfig = {
    backgroundColor: "#2A2A2A",
    backgroundGradientFrom: "#2A2A2A",
    backgroundGradientTo: "#2A2A2A",
    fillShadowGradientFrom: "rgba(194, 96, 21, 1)",
    fillShadowGradientTo: "rgba(255, 156, 17, 1)",
    decimalPlaces: 0,
    color: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
    style: { borderRadius: 10 },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#FF9C11"
    },

    formatYLabel: (value) => Math.round(value).toString(),
    segments: 4,
    yAxisMinValue: 0,

    yAxisMaxValue: (value) => {
      const maxValue = Math.max(...locationStats.datasets[0].data);
      return Math.ceil(maxValue * 1.2); 
    }
  };

  return (
    <View style={styles.container}>
      <Navbar navigation={navigation} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        style={[
          styles.mainContent,
          Platform.OS === 'web' && styles.webMainContent
        ]}
      >
        <View style={styles.contentWrapper}>
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'infractions' && styles.activeTab]}
              onPress={() => setActiveTab('infractions')}
            >
              <Text style={styles.tabText}>Infrações</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'objects' && styles.activeTab]}
              onPress={() => setActiveTab('objects')}
            >
              <Text style={styles.tabText}>Contagem de Objetos</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsGrid}>
            {activeTab === 'infractions' ? (
              <>
                <View style={styles.statCard}>
                  <Text style={styles.statTitle}>Total Infrações</Text>
                  <Text style={styles.statValue}>{infractionStats.totalInfractions}</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statTitle}>Média Diária</Text>
                  <Text style={styles.statValue}>{infractionStats.dailyAverage}</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statTitle}>Tipo Mais Comum</Text>
                  <Text style={styles.statValue}>{infractionStats.mostCommonType}</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statTitle}>Veículo Mais Comum</Text>
                  <Text style={styles.statValue}>{infractionStats.mostCommonVehicle}</Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.statCard}>
                  <Text style={styles.statTitle}>Total Objetos</Text>
                  <Text style={styles.statValue}>{objectStats.totalObjects}</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statTitle}>Média Diária</Text>
                  <Text style={styles.statValue}>{objectStats.dailyAverage}</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statTitle}>Objeto Mais Comum</Text>
                  <Text style={styles.statValue}>{objectStats.mostCommonObject}</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statTitle}>Locais Ativos</Text>
                  <Text style={styles.statValue}>{objectStats.activeLocations}</Text>
                </View>
              </>
            )}
          </View>

          <View style={styles.chartSection}>
            <Text style={styles.chartTitle}>
              {activeTab === 'infractions' ? 'Distribuição Horária de Infrações' : 'Distribuição Horária de Detecções'}
            </Text>
            <ScrollView horizontal={!isWeb} showsHorizontalScrollIndicator={false}>
              <LineChart
                data={hourlyData}
                width={Math.max(contentWidth, 600)}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                withHorizontalLines={true}
                withVerticalLines={false}
                withDots={true}
                withShadow={false}
              />
            </ScrollView>
          </View>

          <View style={styles.chartSection}>
            <Text style={styles.chartTitle}>
              {activeTab === 'infractions' ? 'Distribuição por Local' : 'Tipos de Objetos Detectados'}
            </Text>
            <ScrollView horizontal={!isWeb} showsHorizontalScrollIndicator={false}>
              <BarChart
                data={locationStats}
                width={Math.max(contentWidth, 600)}
                height={220}
                chartConfig={chartConfig}
                style={styles.chart}
                verticalLabelRotation={0}
                showValuesOnTopOfBars={true}
                fromZero={true} 
                segments={4} 
              />
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3E3C3C',
  },
  webMainContent: {
    marginLeft: 190,
    height: '100vh',
    overflow: 'auto',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  contentWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    padding: 5,
    width: '100%',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#C26015',
  },
  tabText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    width: '48%',
  },
  statTitle: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 8,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  chartSection: {
    backgroundColor: '#2A2A2A',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: '100%',
  },
  chartTitle: {
    color: '#C26015',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 8,
    marginVertical: 8,
  },
});