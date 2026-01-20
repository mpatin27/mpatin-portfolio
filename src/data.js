export const projects = [
  {
    id: 1,
    title: "Mon Portfolio",
    description: "Mon site personnel pour présenter mes projets. Optimisé pour la performance et le SEO.",
    cover: "./public/images/portfolio-cover.png", // Chemin vers le dossier public
    tags: ["React", "Vite", "CSS3"],
    links: {
      demo: "https://mpatin-portfolio.vercel.app", // Lien vers le site en ligne
      repo: "https://github.com/mpatin27/mpatin-portfolio" // Lien vers le code
    }
  },
  {
    id: 2,
    title: "Ruche Connectée",
    description: "Application de monitoring pour ruches avec capteurs IoT. Affiche la température, l'humidité et le poids en temps réel.",
    cover: "./public/images/ruche-cover.webp", // Chemin vers le dossier public
    tags: ["Arduino", "NodeRed", "LoRaWAN", "HTML", "CSS3", "JavaScript"],
    links: {
      demo: null, // Si pas de version live, on met null
      repo: "https://github.com/mpatin27/Arduino-MKR-Ruche"
    }
  }
];