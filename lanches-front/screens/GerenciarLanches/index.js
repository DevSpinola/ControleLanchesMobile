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
import { useFocusEffect } from "@react-navigation/native";
import { getLanches, deleteLanche, marcarLancheEntregue } from "../../services/lancheservice";
import { getAlunos } from "../../services/alunoservice";
import CardLanche from "../../components/CardLanche/CardLanche";

export default function GerenciarLanches({ navigation }) {
  const [lanches, setLanches] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      loadData();
    }, []);
  // Função para carregar dados quando a tela receber foco
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [lanchesData, alunosData] = await Promise.all([
        getLanches(),
        getAlunos()
      ]);
      setLanches(lanchesData);
      setAlunos(alunosData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados.");
    } finally {
      setLoading(false);
    }
  };

  // Função para encontrar o aluno pelo RA
  const findAlunoByRA = (ra) => {
    return alunos.find(aluno => aluno.ra === ra);
  };

  const handleEdit = (lanche) => {
    navigation.navigate("SolicitarLanches", { lancheId: lanche.id });
  };

  const handleDelete = (lanche) => {
    const aluno = findAlunoByRA(lanche.raAluno);
    const alunoNome = aluno ? aluno.nome : `RA: ${lanche.raAluno}`;
    
    Alert.alert(
      "Confirmar Exclusão",
      `Deseja realmente excluir a autorização de lanche para ${alunoNome}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => confirmDelete(lanche.id),
        },
      ]
    );
  };

  const confirmDelete = async (id) => {
    try {
      await deleteLanche(id);
      Alert.alert("Sucesso", "Autorização de lanche excluída com sucesso.");
      loadData(); // Recarrega a lista
    } catch (error) {
      console.error("Erro ao excluir lanche:", error);
      Alert.alert("Erro", "Não foi possível excluir a autorização.");
    }
  };

  const handleAddNew = () => {
    navigation.navigate("SolicitarLanches");
  };

  const handleMarcarEntregue = (lanche) => {
    const aluno = findAlunoByRA(lanche.raAluno);
    const alunoNome = aluno ? aluno.nome : `RA: ${lanche.raAluno}`;
    
    Alert.alert(
      "Confirmar Entrega",
      `Marcar lanche de ${alunoNome} como entregue?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Confirmar",
          style: "default",
          onPress: () => confirmMarcarEntregue(lanche.id),
        },
      ]
    );
  };

  const confirmMarcarEntregue = async (id) => {
    try {
      await marcarLancheEntregue(id);
      Alert.alert("Sucesso", "Lanche marcado como entregue.");
      loadData(); // Recarrega a lista
    } catch (error) {
      console.error("Erro ao marcar lanche como entregue:", error);
      Alert.alert("Erro", "Não foi possível marcar o lanche como entregue.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gerenciar Lanches</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      {lanches.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="fast-food-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Nenhuma autorização cadastrada</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={handleAddNew}>
            <Text style={styles.emptyButtonText}>Cadastrar Primeira Autorização</Text>
          </TouchableOpacity>
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
              onEdit={() => handleEdit(lanche)}
              onDelete={() => handleDelete(lanche)}
              onMarcarEntregue={() => handleMarcarEntregue(lanche)}
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
    textAlign: "center",
  },
  emptyButton: {
    backgroundColor: "#FF9500",
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
