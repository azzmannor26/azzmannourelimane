# Définition des paramètres
#nour el imane azzman
#-silia el ghazi
#-aya ahmyttou
beta <- 0.3
gamma <- 0.1

# Définition des équations différentielles
dS <- function(S, I, R, beta) {
  return(-beta * S * I)
}

dI <- function(S, I, R, beta, gamma) {
  return(beta * S * I - gamma * I)
}

dR <- function(S, I, R, gamma) {
  return(gamma * I)
}

# Méthode de Runge-Kutta d'ordre 4
runge_kutta <- function(S, I, R, dS, dI, dR, beta, gamma, h) {
  k1_S <- dS(S, I, R, beta)
  k1_I <- dI(S, I, R, beta, gamma)
  k1_R <- dR(S, I, R, gamma)
  
  k2_S <- dS(S + 0.5 * h * k1_S, I + 0.5 * h * k1_I, R + 0.5 * h * k1_R, beta)
  k2_I <- dI(S + 0.5 * h * k1_S, I + 0.5 * h * k1_I, R + 0.5 * h * k1_R, beta, gamma)
  k2_R <- dR(S + 0.5 * h * k1_S, I + 0.5 * h * k1_I, R + 0.5 * h * k1_R, gamma)
  
  k3_S <- dS(S + 0.5 * h * k2_S, I + 0.5 * h * k2_I, R + 0.5 * h * k2_R, beta)
  k3_I <- dI(S + 0.5 * h * k2_S, I + 0.5 * h * k2_I, R + 0.5 * h * k2_R, beta, gamma)
  k3_R <- dR(S + 0.5 * h * k2_S, I + 0.5 * h * k2_I, R + 0.5 * h * k2_R, gamma)
  
  k4_S <- dS(S + h * k3_S, I + h * k3_I, R + h * k3_R, beta)
  k4_I <- dI(S + h * k3_S, I + h * k3_I, R + h * k3_R, beta, gamma)
  k4_R <- dR(S + h * k3_S, I + h * k3_I, R + h * k3_R, gamma)
  
  S_new <- S + (h / 6) * (k1_S + 2 * k2_S + 2 * k3_S + k4_S)
  I_new <- I + (h / 6) * (k1_I + 2 * k2_I + 2 * k3_I + k4_I)
  R_new <- R + (h / 6) * (k1_R + 2 * k2_R + 2 * k3_R + k4_R)
  
  return(c(S_new, I_new, R_new))
}

# Paramètres initiaux
S0 <- 0.9
I0 <- 0.1
R0 <- 0.0

# Intervalle de temps
t <- seq(0, 50, by = 1)

# Pas de temps
h <- 1

# Résolution du système d'équations différentielles avec Runge-Kutta
result <- matrix(0, nrow = length(t), ncol = 3)
result[1, ] <- c(S0, I0, R0)

for (i in 2:length(t)) {
  result[i, ] <- runge_kutta(result[i - 1, 1], result[i - 1, 2], result[i - 1, 3], dS, dI, dR, beta, gamma, h)
}

# Tracé des résultats
plot(t, result[, 1], type = 'l', col = 'blue', xlab = 'Temps', ylab = 'S(t)', main = 'Modèle SIR avec Runge-Kutta')
lines(t, result[, 2], col = 'red')
lines(t, result[, 3], col = 'green')
legend('topright', legend = c('S(t)', 'I(t)', 'R(t)'), col = c('blue', 'red', 'green'), lty = 1)