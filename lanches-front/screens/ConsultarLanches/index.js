import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { getLanchesByData } from "../../services/lancheservice";
import { getAlunos } from "../../services/alunoservice";
import CardLanche from "../../components/CardLanche/CardLanche";

export default function ConsultarLanches({ navigation, route }) {
  const [dataConsulta, setDataConsulta] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [lanches, setLanches] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [consultaRealizada, setConsultaRealizada] = useState(false);

  // Função para formatar data para exibição (DD/MM/AAAA)
  const formatDateForDisplay = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Função para converter Date para AAAA-MM-DD para a API
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Função para lidar com mudança de data
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dataConsulta;
    setShowDatePicker(Platform.OS === 'ios');
    setDataConsulta(currentDate);
  };

  // Função para consultar lanches
  const consultarLanches = async () => {
    try {
      setLoading(true);
      const dataFormatada = formatDateForAPI(dataConsulta);
      
      const [lanchesData, alunosData] = await Promise.all([
        getLanchesByData(dataFormatada),
        getAlunos()
      ]);
      
      setLanches(lanchesData);
      setAlunos(alunosData);
      setConsultaRealizada(true);
      
      if (lanchesData.length === 0) {
        Alert.alert("Informação", "Nenhuma autorização encontrada para esta data.");
      }
    } catch (error) {
      console.error("Erro ao consultar lanches:", error);
      Alert.alert("Erro", "Não foi possível consultar os lanches.");
    } finally {
      setLoading(false);
    }
  };

  // Função para encontrar o aluno pelo RA
  const findAlunoByRA = (ra) => {
    return alunos.find(aluno => aluno.ra === ra);
  };

  return (
    <View style={styles.container}>
      {/* Header de consulta */}
      <View style={styles.consultaContainer}>
        <Text style={styles.title}>Consultar Lanches por Data</Text>
        
        <Text style={styles.label}>Data da Consulta:</Text>
        <TouchableOpacity 
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar" size={20} color="#007AFF" />
          <Text style={styles.datePickerText}>
            {formatDateForDisplay(dataConsulta)}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dataConsulta}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onDateChange}
            minimumDate={new Date(2020, 0, 1)}
            maximumDate={new Date(2030, 11, 31)}
          />
        )}

        <TouchableOpacity 
          style={[styles.consultarButton, loading && styles.consultarButtonDisabled]} 
          onPress={consultarLanches}
          disabled={loading}
        >
          <Ionicons name="search" size={20} color="white" />
          <Text style={styles.consultarButtonText}>
            {loading ? "Consultando..." : "Consultar"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Resultados */}
      {consultaRealizada && (
        <View style={styles.resultadosContainer}>
          <View style={styles.resultadosHeader}>
            <Text style={styles.resultadosTitle}>
              Resultados ({lanches.length})
            </Text>
            <Text style={styles.resultadosSubtitle}>
              {formatDateForDisplay(dataConsulta)}
            </Text>
          </View>

          {lanches.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>
                Nenhuma autorização para esta data
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.scrollContainer}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            >
              {lanches.map((lanche) => (
                <CardLanche
                  key={lanche.id}
                  lanche={lanche}
                  aluno={findAlunoByRA(lanche.raAluno)}
                  onEdit={() => {}} // Somente visualização
                  onDelete={() => {}} // Somente visualização
                  onMarcarEntregue={() => {}} // Somente visualização
                />
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  consultaContainer: {
    backgroundColor: "white",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    backgroundColor: "white",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  datePickerText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  consultarButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  consultarButtonDisabled: {
    backgroundColor: "#ccc",
  },
  consultarButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },
  resultadosContainer: {
    flex: 1,
  },
  resultadosHeader: {
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  resultadosTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  resultadosSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },
});