import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CardLanche({ lanche, aluno, onEdit, onDelete, onMarcarEntregue }) {
  // Função para formatar a data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <View style={styles.card}>
      {/* Header simples */}
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Ionicons name="fast-food" size={16} color="white" />
          <Text style={styles.cardTitle}>LANCHE</Text>
        </View>
        <View style={styles.actions}>
          {!lanche.entregue && (
            <TouchableOpacity style={styles.deliverButton} onPress={onMarcarEntregue}>
              <Ionicons name="checkmark" size={18} color="white" />
            </TouchableOpacity>
          )}
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
        {/* ID do Lanche */}
        <View style={styles.idContainer}>
          <View style={styles.idBadge}>
            <Text style={styles.idText}>#{lanche.id}</Text>
          </View>
        </View>

        {/* Informações do Lanche */}
        <View style={styles.infoContainer}>
          <Text style={styles.studentName}>{aluno ? aluno.nome : `RA: ${lanche.raAluno}`}</Text>
          
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar" size={16} color="#666" />
              <Text style={styles.detailLabel}>Data:</Text>
              <Text style={styles.detailValue}>{formatDate(lanche.dataLiberacao)}</Text>
            </View>
          </View>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Ionicons name="restaurant" size={16} color="#666" />
              <Text style={styles.detailLabel}>Qtd:</Text>
              <Text style={styles.quantityValue}>{lanche.quantidade}</Text>
            </View>
          </View>

          {/* Status de entrega */}
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, lanche.entregue ? styles.statusEntregue : styles.statusPendente]}>
              <Ionicons 
                name={lanche.entregue ? "checkmark-circle" : "time"} 
                size={14} 
                color={lanche.entregue ? "#4CAF50" : "#FF9500"} 
              />
              <Text style={[styles.statusText, lanche.entregue ? styles.statusTextEntregue : styles.statusTextPendente]}>
                {lanche.entregue ? "Entregue" : "Pendente"}
              </Text>
            </View>
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
    borderLeftColor: "#FF9500",
  },
  cardHeader: {
    backgroundColor: "#FF9500",
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
  deliverButton: {
    backgroundColor: "#4CAF50",
    padding: 6,
    borderRadius: 4,
  },
  editButton: {
    backgroundColor: "#007AFF",
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
  idContainer: {
    marginRight: 16,
    justifyContent: "center",
  },
  idBadge: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
  },
  idText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF9500",
    fontFamily: "monospace",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  studentName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
    marginRight: 8,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF9500",
    fontFamily: "monospace",
  },
  statusContainer: {
    marginTop: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusEntregue: {
    backgroundColor: "#E8F5E8",
  },
  statusPendente: {
    backgroundColor: "#FFF3E0",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  statusTextEntregue: {
    color: "#4CAF50",
  },
  statusTextPendente: {
    color: "#FF9500",
  },
});