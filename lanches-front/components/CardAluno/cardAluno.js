import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CardAluno({ aluno, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      {/* Header simples */}
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Ionicons name="school" size={16} color="white" />
          <Text style={styles.cardTitle}>ALUNO</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <Ionicons name="pencil" size={18} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Ionicons name="trash" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Conteúdo do Card */}
      <View style={styles.cardContent}>
        {/* Foto do Aluno */}
        <View style={styles.photoContainer}>
          {aluno.foto ? (
            <Image
              source={{ uri: aluno.foto }}
              style={styles.photo}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="person" size={40} color="#999" />
            </View>
          )}
        </View>

        {/* Informações do Aluno */}
        <View style={styles.infoContainer}>
          <Text style={styles.studentName}>{aluno.nome}</Text>
          <View style={styles.raContainer}>
            <Text style={styles.raLabel}>RA:</Text>
            <Text style={styles.raNumber}>{aluno.ra}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  cardHeader: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    backgroundColor: "#FF9500",
    padding: 6,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 6,
    borderRadius: 4,
  },
  cardContent: {
    flexDirection: "row",
    padding: 16,
  },
  photoContainer: {
    marginRight: 16,
  },
  photo: {
    width: 80,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  photoPlaceholder: {
    width: 80,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  studentName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  raContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  raLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 8,
  },
  raNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    fontFamily: "monospace",
  },
});