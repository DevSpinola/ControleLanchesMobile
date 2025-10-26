// Codigo para gerenciar todos alunos, listando todos, colocando icones para delecao
// e edicao, e um botao para adicionar novos alunos, o botao de editar e adicionar deve redirecionar para a pagina de cadastro
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAlunos, deleteAluno } from "../../services/alunoservice";
import CardAluno from "../../components/CardAluno/cardAluno";

export default function GerenciarAlunos({ navigation }) {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAlunos();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadAlunos();
    });
    return unsubscribe;
  }, [navigation]);

  const loadAlunos = async () => {
    try {
      setLoading(true);
      const data = await getAlunos();
      setAlunos(data);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      Alert.alert("Erro", "Não foi possível carregar a lista de alunos.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (aluno) => {
    navigation.navigate("CadastroAluno", { alunoId: aluno.ra });
  };

  const handleDelete = (aluno) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Deseja realmente excluir o aluno ${aluno.nome}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => confirmDelete(aluno.ra),
        },
      ]
    );
  };

  const confirmDelete = async (ra) => {
    try {
      await deleteAluno(ra);
      Alert.alert("Sucesso", "Aluno excluído com sucesso.");
      loadAlunos(); // Recarrega a lista
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
      Alert.alert("Erro", "Não foi possível excluir o aluno.");
    }
  };

  const handleAddNew = () => {
    navigation.navigate("CadastroAluno");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gerenciar Alunos</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      {alunos.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="school-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Nenhum aluno cadastrado</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={handleAddNew}>
            <Text style={styles.emptyButtonText}>Cadastrar Primeiro Aluno</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        >
          {alunos.map((aluno) => (
            <CardAluno
              key={aluno.ra}
              aluno={aluno}
              onEdit={() => handleEdit(aluno)}
              onDelete={() => handleDelete(aluno)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#34C759",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 4,
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
    fontSize: 18,
    color: "#666",
    marginTop: 16,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});