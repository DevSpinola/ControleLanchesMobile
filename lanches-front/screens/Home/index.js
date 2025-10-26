import { View, StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Home({ navigation, route }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="restaurant" size={32} color="#007AFF" />
        <Text style={styles.title}>Controle de Lanches</Text>
        <Text style={styles.subtitle}>Sistema de Gestão Escolar</Text>
      </View>

      {/* Menu de Opções */}
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate("SolicitarLanches")}
        >
          <Ionicons name="fast-food" size={24} color="#007AFF" />
          <Text style={styles.menuText}>Solicitar Lanche</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate("GerenciarLanches")}
        >
          <Ionicons name="restaurant" size={24} color="#007AFF" />
          <Text style={styles.menuText}>Gerenciar Lanches</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate("GerenciarAlunos")}
        >
          <Ionicons name="people" size={24} color="#007AFF" />
          <Text style={styles.menuText}>Gerenciar Alunos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate("CadastroAluno")}
        >
          <Ionicons name="person-add" size={24} color="#007AFF" />
          <Text style={styles.menuText}>Cadastrar Aluno</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#676666ff",
    marginTop: 5,
    textAlign: "center",
  },
  menuContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  menuButton: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  menuContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  menuText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
    marginLeft: 10,
  },
  menuSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
    fontStyle: "italic",
  },
});
