# Définition des paramètres
#-nour el imane azzman
#-silia el ghazi
#-aya ahmyttou
beta <- 0.3
gamma <- 0.1

# Définition des équations différentielles
dS <- function(S, I, beta, gamma) {
  return(-beta * S * I + gamma * I)
}

dI <- function(S, I, beta, gamma) {
  return(beta * S * I - gamma * I)
}

# Méthode de Runge-Kutta d'ordre 4
runge_kutta <- function(S, I, dS, dI, beta, gamma, h) {
  k1_S <- dS(S, I, beta, gamma)
  k1_I <- dI(S, I, beta, gamma)
  
  k2_S <- dS(S + 0.5 * h * k1_S, I + 0.5 * h * k1_I, beta, gamma)
  k2_I <- dI(S + 0.5 * h * k1_S, I + 0.5 * h * k1_I, beta, gamma)
  
  k3_S <- dS(S + 0.5 * h * k2_S, I + 0.5 * h * k2_I, beta, gamma)
  k3_I <- dI(S + 0.5 * h * k2_S, I + 0.5 * h * k2_I, beta, gamma)
  
  k4_S <- dS(S + h * k3_S, I + h * k3_I, beta, gamma)
  k4_I <- dI(S + h * k3_S, I + h * k3_I, beta, gamma)
  
  S_new <- S + (h / 6) * (k1_S + 2 * k2_S + 2 * k3_S + k4_S)
  I_new <- I + (h / 6) * (k1_I + 2 * k2_I + 2 * k3_I + k4_I)
  
  return(c(S_new, I_new))
}

# Paramètres initiaux
S0 <- 0.9
I0 <- 0.1

# Intervalle de temps
t <- seq(0, 50, by = 1)

# Pas de temps
h <- 1

# Résolution du système d'équations différentielles avec Runge-Kutta
result <- matrix(0, nrow = length(t), ncol = 2)
result[1, ] <- c(S0, I0)

for (i in 2:length(t)) {
  result[i, ] <- runge_kutta(result[i - 1, 1], result[i - 1, 2], dS, dI, beta, gamma, h)
}

# Tracé des résultats
plot(t, result[, 1], type = 'l', col = 'blue', xlab = 'Temps', ylab = 'S(t)', main = 'Modèle SIS avec Runge-Kutta')
lines(t, result[, 2], col = 'red')
legend('topright', legend = c('S(t)', 'I(t)'), col = c('blue', 'red'), lty = 1)