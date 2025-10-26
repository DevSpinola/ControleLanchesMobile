import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
import SolicitarLanches from './screens/SolicitarLanches';
import GerenciarLanches from './screens/GerenciarLanches';
import GerenciarAlunos from './screens/GerenciarAlunos/gerenciarAlunos';
import CadastroAluno from './screens/CadastroAluno/cadastroAluno';
import ConsultarLanches from './screens/ConsultarLanches';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ headerBackVisible: false,  }} />
        <Stack.Screen name="GerenciarAlunos" component={GerenciarAlunos} options={{ headerBackVisible: true, headerShown: true, title: "Gerenciar Alunos" }} />
        <Stack.Screen name="CadastroAluno" component={CadastroAluno} options={{ headerBackVisible: true, headerShown: true }} />
        <Stack.Screen name="GerenciarLanches" component={GerenciarLanches} options={{ headerBackVisible: true , animation: 'slide_from_bottom'}} />
        <Stack.Screen 
          name="SolicitarLanches" 
          component={SolicitarLanches} 
          options={({ route }) => ({
            headerBackVisible: true, 
            headerShown: true,
            title: route.params?.lancheId ? "Editar Autorização" : "Solicitar Lanche"
          })} 
        />
        <Stack.Screen 
          name="ConsultarLanches" 
          component={ConsultarLanches} 
          options={{ headerBackVisible: true, headerShown: true, title: "Consultar Lanches" }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
