
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase';
import { Slot, useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

const useProtectedRoute = (user: User | null, loading: boolean) => {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Previne o redirecionamento enquanto o app ainda está carregando.
    if (loading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Se o usuário não está logado e não está no grupo de autenticação,
      // redireciona para a tela de login.
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // Se o usuário está logado e está em uma tela de autenticação,
      // redireciona para a tela principal (home).
      router.replace('/home');
    }
  }, [user, loading, segments, router]);
};

const InitialLayout = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  // Passa o estado de 'loading' para o hook de proteção.
  useProtectedRoute(user, loading);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  return <Slot />;
};

export default InitialLayout;