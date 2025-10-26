import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  createLanche,
  updateLanche,
  getLancheById,
  getNextLancheId,
  getLanchesByData,
} from "../../services/lancheservice";
import { getAlunos } from "../../services/alunoservice";

export default function SolicitarLanches({ navigation, route }) {
  const [id, setId] = useState("");
  const [dataLiberacao, setDataLiberacao] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [raAluno, setRaAluno] = useState("");
  const [quantidade, setQuantidade] = useState("1");
  const [alunos, setAlunos] = useState([]);
  const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const lancheId = route.params ? route.params.lancheId : null;
  const isEditing = !!lancheId;

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Carregar lista de alunos
      const alunosData = await getAlunos();
      setAlunos(alunosData);

      if (isEditing) {
        // Se está editando, carregar dados do lanche
        const lanche = await getLancheById(lancheId);
        setId(lanche.id);
        setDataLiberacao(new Date(lanche.dataLiberacao));
        setRaAluno(lanche.raAluno);
        setQuantidade(lanche.quantidade.toString());
        setAlunosDisponiveis(alunosData); // Em edição, mostrar todos
      } else {
        // Se é novo cadastro, buscar próximo ID
        const nextId = await getNextLancheId();
        setId(nextId.toString());
        
        // Definir data atual como padrão
        const hoje = new Date();
        setDataLiberacao(hoje);
        
        // Filtrar alunos disponíveis para hoje
        await filterAlunosDisponiveisInicial(hoje, alunosData);
      }
    } catch (error) {
      console.error("Erro ao carregar dados iniciais:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados necessários.");
    } finally {
      setLoading(false);
    }
  };

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
    const currentDate = selectedDate || dataLiberacao;
    setShowDatePicker(Platform.OS === 'ios');
    setDataLiberacao(currentDate);
    
    // Quando a data muda, filtrar alunos disponíveis
    if (!isEditing) {
      filterAlunosDisponiveis(currentDate);
    }
  };

  // Função para filtrar alunos que não têm lanche na data selecionada
  const filterAlunosDisponiveis = async (data) => {
    try {
      const dataFormatada = formatDateForAPI(data);
      const lanchesNaData = await getLanchesByData(dataFormatada);
      
      // RAs que já têm lanche na data
      const rasComLanche = lanchesNaData.map(lanche => lanche.raAluno);
      
      // Filtrar alunos que não estão na lista
      const alunosFiltrados = alunos.filter(aluno => 
        !rasComLanche.includes(aluno.ra) || (isEditing && aluno.ra === raAluno)
      );
      
      setAlunosDisponiveis(alunosFiltrados);
      
      // Se o aluno selecionado não está mais disponível, limpar seleção
      if (raAluno && !alunosFiltrados.some(aluno => aluno.ra === raAluno) && !isEditing) {
        setRaAluno("");
      }
    } catch (error) {
      console.error("Erro ao filtrar alunos:", error);
      setAlunosDisponiveis(alunos); // Em caso de erro, mostrar todos
    }
  };

  // Função auxiliar para filtro inicial
  const filterAlunosDisponiveisInicial = async (data, alunosData) => {
    try {
      const dataFormatada = formatDateForAPI(data);
      const lanchesNaData = await getLanchesByData(dataFormatada);
      const rasComLanche = lanchesNaData.map(lanche => lanche.raAluno);
      const alunosFiltrados = alunosData.filter(aluno => !rasComLanche.includes(aluno.ra));
      setAlunosDisponiveis(alunosFiltrados);
    } catch (error) {
      console.error("Erro ao filtrar alunos inicial:", error);
      setAlunosDisponiveis(alunosData);
    }
  };

  const handleCreate = async () => {
    if (!validateFields()) return;
    
    console.log("Dados a serem enviados:", {
      id: id.trim(),
      dataLiberacao: formatDateForAPI(dataLiberacao),
      raAluno: raAluno,
      quantidade: parseInt(quantidade)
    });
    
    try {
      setLoading(true);
      const result = await createLanche({ 
        id: id.trim(),
        dataLiberacao: formatDateForAPI(dataLiberacao),
        raAluno: raAluno,
        quantidade: parseInt(quantidade),
        entregue: false
      });
      
      console.log("Resposta da API:", result);
      Alert.alert("Sucesso", "Autorização de lanche cadastrada com sucesso.");
      navigation.goBack();
    } catch (error) {
      console.error("Erro completo:", error);
      console.error("Resposta da API:", error.response?.data);
      
      const errorMessage = error.response?.data?.erro || error.message || "Erro desconhecido";
      Alert.alert("Erro", `Não foi possível cadastrar a autorização: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!validateFields()) return;
    
    try {
      setLoading(true);
      await updateLanche(lancheId, { 
        id: id.trim(),
        dataLiberacao: formatDateForAPI(dataLiberacao),
        raAluno: raAluno,
        quantidade: parseInt(quantidade)
      });
      
      Alert.alert("Sucesso", "Autorização de lanche atualizada com sucesso.");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao atualizar lanche:", error);
      const errorMessage = error.response?.data?.erro || error.message || "Erro desconhecido";
      Alert.alert("Erro", `Não foi possível atualizar a autorização: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const validateFields = () => {
    if (!id.trim()) {
      Alert.alert("Erro", "ID é obrigatório.");
      return false;
    }
    
    if (!dataLiberacao) {
      Alert.alert("Erro", "Selecione uma data de liberação.");
      return false;
    }
    
    if (!raAluno) {
      Alert.alert("Erro", "Selecione um aluno.");
      return false;
    }
    
    const qtd = parseInt(quantidade);
    if (!qtd || qtd < 1 || qtd > 3) {
      Alert.alert("Erro", "Quantidade deve ser entre 1 e 3.");
      return false;
    }
    
    return true;
  };

  const getAlunoNome = (ra) => {
    const aluno = alunosDisponiveis.find(a => a.ra === ra);
    return aluno ? aluno.nome : "Aluno não encontrado";
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>ID da Autorização:</Text>
        <TextInput 
          style={[styles.input, isEditing && styles.inputDisabled]} 
          value={id} 
          onChangeText={setId}
          placeholder="ID será gerado automaticamente"
          placeholderTextColor="#999"
          editable={!isEditing}
        />

        <Text style={styles.label}>Data de Liberação:</Text>
        <TouchableOpacity 
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar" size={20} color="#007AFF" />
          <Text style={styles.datePickerText}>
            {formatDateForDisplay(dataLiberacao)}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dataLiberacao}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onDateChange}
            minimumDate={new Date(2020, 0, 1)}
            maximumDate={new Date(2030, 11, 31)}
          />
        )}

        <Text style={styles.label}>Aluno:</Text>
        {!isEditing && (
          <Text style={styles.infoText}>
            {alunosDisponiveis.length} aluno(s) disponível(is) para esta data
          </Text>
        )}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={raAluno}
            onValueChange={(itemValue) => setRaAluno(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione um aluno" value="" />
            {alunosDisponiveis.map((aluno) => (
              <Picker.Item 
                key={aluno.ra} 
                label={`${aluno.nome} (RA: ${aluno.ra})`} 
                value={aluno.ra} 
              />
            ))}
          </Picker>
        </View>

        {raAluno && (
          <View style={styles.selectedAluno}>
            <Ionicons name="person-circle" size={24} color="#007AFF" />
            <Text style={styles.selectedAlunoText}>{getAlunoNome(raAluno)}</Text>
          </View>
        )}

        <Text style={styles.label}>Quantidade de Lanches:</Text>
        <View style={styles.quantidadeContainer}>
          <TouchableOpacity 
            style={styles.quantidadeButton}
            onPress={() => {
              const newQtd = Math.max(1, parseInt(quantidade) - 1);
              setQuantidade(newQtd.toString());
            }}
          >
            <Ionicons name="remove" size={20} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.quantidadeText}>{quantidade}</Text>
          
          <TouchableOpacity 
            style={styles.quantidadeButton}
            onPress={() => {
              const newQtd = Math.min(3, parseInt(quantidade) + 1);
              setQuantidade(newQtd.toString());
            }}
          >
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.submitButtonDisabled]} 
          onPress={isEditing ? handleUpdate : handleCreate}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading 
              ? "Processando..." 
              : isEditing 
                ? "✓ Atualizar Autorização" 
                : "✓ Cadastrar Autorização"
            }
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    backgroundColor: "white",
    fontSize: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputDisabled: {
    backgroundColor: "#f5f5f5",
    color: "#999",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
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
  picker: {
    height: 50,
  },
  selectedAluno: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e3f2fd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  selectedAlunoText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#1976d2",
    fontWeight: "500",
  },
  quantidadeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  quantidadeButton: {
    backgroundColor: "#FF9500",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  quantidadeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF9500",
    marginHorizontal: 30,
    minWidth: 40,
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#34C759",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  helperText: {
    fontSize: 12,
    color: "#666",
    marginTop: -15,
    marginBottom: 20,
    fontStyle: "italic",
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
  infoText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    fontStyle: "italic",
  },
});
