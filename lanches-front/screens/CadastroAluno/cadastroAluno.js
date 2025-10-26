// 1 - Crie uma tela para CRUD dos alunos. A tela deve solicitar:

// * RA

// * Nome

// * Foto do aluno

// Obs: todos os campos são obrigatórios]
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  createAluno,
  updateAluno,
  getAlunoById,
} from "../../services/alunoservice";

export default function CadastroAluno({ navigation, route }) {
  const [ra, setRa] = useState("");
  const [nome, setNome] = useState("");
  const [foto, setFoto] = useState(null);
  const alunoId = route.params ? route.params.alunoId : null;

  useEffect(() => {
    if (alunoId) {
      getAlunoById(alunoId)
        .then((aluno) => {
          setRa(aluno.ra);
          setNome(aluno.nome);
          setFoto(aluno.foto);
        })
        .catch((error) => {
          console.error("Erro ao buscar aluno:", error);
          Alert.alert("Erro", "Não foi possível buscar os dados do aluno.");
        });
    }
  }, [alunoId]);

  // Função para converter URI da imagem para Base64
  const convertToBase64 = async (uri) => {
    try {
      console.log("Iniciando conversão para Base64...");
      const response = await fetch(uri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          console.log("Conversão concluída!");
          resolve(reader.result);
        };
        reader.onerror = (error) => {
          console.error("Erro no FileReader:", error);
          reject(error);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Erro ao converter imagem para Base64:", error);
      throw error;
    }
  };

  const pickImage = async () => {
    console.log("Botão de selecionar foto clicado!");
    
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5, // Reduzindo ainda mais - 50%
        base64: false,
        // Configurações de redimensionamento
        exif: false,
        allowsMultipleSelection: false,
      });
      
      console.log("Resultado do ImagePicker:", result);
      
      if (!result.canceled) {
        try {
          // Converte a imagem para Base64
          console.log("Convertendo imagem para Base64...");
          const base64Image = await convertToBase64(result.assets[0].uri);
          
          // Verificar tamanho da string Base64
          const sizeInKB = Math.round((base64Image.length * 3) / 4 / 1024);
          console.log(`Tamanho da imagem: ${sizeInKB}KB`);
          
          if (sizeInKB > 500) { // Se maior que 500KB
            Alert.alert("Aviso", `Imagem muito grande (${sizeInKB}KB). Tente uma imagem menor.`);
            return;
          }
          
          setFoto(base64Image);
          console.log("Imagem convertida com sucesso!");
        } catch (error) {
          console.error("Erro na conversão:", error);
          Alert.alert("Erro", "Não foi possível processar a imagem.");
        }
      }
    } catch (error) {
      console.error("Erro no ImagePicker:", error);
      Alert.alert("Erro", "Não foi possível abrir a galeria.");
    }
  };
  const handleCreate = async () => {
    if (!ra || !nome || !foto) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }
    
    // Validações básicas no frontend
    if (nome.length < 2) {
      Alert.alert("Erro", "Nome deve ter pelo menos 2 caracteres.");
      return;
    }
    
    if (!ra.trim()) {
      Alert.alert("Erro", "RA é obrigatório.");
      return;
    }
    
    console.log("Dados a serem enviados:", {
      ra: ra.trim(),
      nome: nome.trim(),
      fotoTamanho: foto ? `${Math.round((foto.length * 3) / 4 / 1024)}KB` : "Sem foto",
      fotoInicio: foto ? foto.substring(0, 50) + "..." : "Sem foto"
    });
    
    try {
      const result = await createAluno({ 
        ra: ra.trim(), 
        nome: nome.trim(), 
        foto: foto 
      });
      console.log("Resposta da API:", result);
      Alert.alert("Sucesso", "Aluno cadastrado com sucesso.");
      navigation.goBack();
    } catch (error) {
      console.error("Erro completo:", error);
      console.error("Resposta da API:", error.response?.data);
      console.error("Status:", error.response?.status);
      
      const errorMessage = error.response?.data?.erro || error.message || "Erro desconhecido";
      Alert.alert("Erro", `Não foi possível cadastrar o aluno: ${errorMessage}`);
    }
  };
    const handleUpdate = async () => {
    if (!ra || !nome || !foto) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }
    try {
      await updateAluno(alunoId, { ra, nome, foto });
      Alert.alert("Sucesso", "Aluno atualizado com sucesso.");
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      Alert.alert("Erro", "Não foi possível atualizar o aluno.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>RA:</Text>
      <TextInput 
        style={styles.input} 
        value={ra} 
        onChangeText={setRa}
        placeholder="Digite o RA do aluno"
        placeholderTextColor="#999"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Nome:</Text>
      <TextInput 
        style={styles.input} 
        value={nome} 
        onChangeText={setNome}
        placeholder="Digite o nome completo"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Foto:</Text>
      <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
        <Text style={styles.photoButtonText}>📷 Selecionar Foto</Text>
      </TouchableOpacity>
      {foto && (
        <Image 
          source={{ uri: foto.startsWith('data:') ? foto : foto }} 
          style={styles.image}
          resizeMode="contain"
        />
      )}

      <TouchableOpacity 
        style={styles.submitButton} 
        onPress={alunoId ? handleUpdate : handleCreate}
      >
        <Text style={styles.submitButtonText}>
          {alunoId ? "✓ Atualizar Aluno" : "✓ Cadastrar Aluno"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
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
  photoButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  photoButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
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
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    alignSelf: "center",
    backgroundColor: "white",
  },
});
