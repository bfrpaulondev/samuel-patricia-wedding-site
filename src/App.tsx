import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import apiService from "./services/api";

type CountdownState = { days: string; hours: string; minutes: string; seconds: string };

const WEDDING_DATE = new Date("2026-05-17T00:00:00");

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function calcCountdown(): CountdownState {
  const now = new Date();
  const diff = WEDDING_DATE.getTime() - now.getTime();

  if (diff <= 0) return { days: "00", hours: "00", minutes: "00", seconds: "00" };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days: pad2(days), hours: pad2(hours), minutes: pad2(minutes), seconds: pad2(seconds) };
}

function launchConfetti(durationMs = 3000) {
  const animationEnd = Date.now() + durationMs;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      window.clearInterval(interval);
      return;
    }
    const particleCount = 50 * (timeLeft / durationMs);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ["#7C5BA6", "#B39CD0", "#8FAA96", "#D4AF76", "#E8B4B8"],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ["#7C5BA6", "#B39CD0", "#8FAA96", "#D4AF76", "#E8B4B8"],
    });
  }, 250);
}

function addToCalendar(eventType: "ceremony" | "party") {
  const title =
    eventType === "ceremony"
      ? "Casamento Samuel & Patrícia - Cerimônia"
      : "Casamento Samuel & Patrícia - Recepção";

  const location =
    eventType === "ceremony"
      ? "Estr. Montureiras Novas 36, 2910-619 Setúbal"
      : "Quinta do Patrício, Setúbal";

  const details = "Celebração do casamento de Samuel e Patrícia. Contamos com a sua presença!";
  const startDate = "20260517";
  const endDate = "20260518";

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}

function SectionTitle({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography
        component="h2"
        sx={{
          fontFamily: '"Playfair Display", serif',
          fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
          color: light ? "var(--white)" : "var(--deep-purple)",
          display: "inline-block",
          position: "relative",
          mb: 4,
          "&:after": {
            content: '""',
            position: "absolute",
            left: "50%",
            bottom: -14,
            transform: "translateX(-50%)",
            width: "60%",
            height: 3,
            borderRadius: 2,
            background: "var(--gradient-sunset)",
          },
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}

function FloatingFlowers() {
  const items = useMemo(
    () => [
      { emoji: "🌸", left: 10, delay: 0, duration: 25 },
      { emoji: "🌺", left: 30, delay: 3, duration: 20 },
      { emoji: "🌼", left: 50, delay: 6, duration: 22 },
      { emoji: "🌻", left: 70, delay: 2, duration: 24 },
      { emoji: "🌷", left: 90, delay: 4, duration: 26 },
    ],
    []
  );

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
      aria-hidden
    >
      {items.map((it, idx) => (
        <motion.div
          key={idx}
          style={{
            position: "absolute",
            left: `${it.left}%`,
            top: 0,
            fontSize: 30,
          }}
          initial={{ y: -100, rotate: 0, opacity: 0 }}
          animate={{
            y: ["-100px", "100vh"],
            rotate: [0, 360],
            opacity: [0, 0.15, 0.15, 0],
          }}
          transition={{
            duration: it.duration,
            delay: it.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {it.emoji}
        </motion.div>
      ))}
    </Box>
  );
}

function Countdown() {
  const [time, setTime] = useState<CountdownState>(() => calcCountdown());

  useEffect(() => {
    const t = window.setInterval(() => setTime(calcCountdown()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const items = [
    { label: "Dias", value: time.days },
    { label: "Horas", value: time.hours },
    { label: "Minutos", value: time.minutes },
    { label: "Segundos", value: time.seconds },
  ];

  return (
    <Box sx={{ position: "relative", overflow: "hidden", py: { xs: 10, md: 12 }, background: "var(--gradient-primary)" }}>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.35,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.14) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          animation: "bgMove 20s linear infinite",
          "@keyframes bgMove": { from: { transform: "translate(0,0)" }, to: { transform: "translate(50px,50px)" } },
        }}
        aria-hidden
      />

      <Container sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          sx={{
            textAlign: "center",
            fontFamily: '"Playfair Display", serif',
            fontSize: { xs: "1.8rem", md: "3rem" },
            color: "var(--white)",
            mb: 6,
            textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          Contagem Regressiva para o Grande Dia
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            gap: { xs: 2, md: 3 },
            maxWidth: 900,
            mx: "auto",
          }}
        >
          {items.map((it) => (
            <motion.div
              key={it.label}
              whileHover={{ y: -12, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              <Box
                sx={{
                  textAlign: "center",
                  borderRadius: "25px",
                  p: { xs: 3, md: 5 },
                  background: "rgba(255,255,255,0.15)",
                  border: "2px solid rgba(255,255,255,0.3)",
                  backdropFilter: "blur(20px)",
                  boxShadow:
                    "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 700,
                    fontSize: { xs: "2.6rem", md: "4rem" },
                    color: "var(--white)",
                    lineHeight: 1,
                    textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
                  }}
                >
                  {it.value}
                </Typography>
                <Typography
                  sx={{
                    mt: 1.5,
                    textTransform: "uppercase",
                    letterSpacing: 3,
                    fontWeight: 700,
                    color: "var(--light-lavender)",
                    fontSize: { xs: "0.9rem", md: "1.1rem" },
                  }}
                >
                  {it.label}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [confirmacao, setConfirmacao] = useState<"" | "sim" | "nao">("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
  
  // Check status states
  const [checkEmail, setCheckEmail] = useState("");
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusResult, setStatusResult] = useState<any>(null);
  const [statusError, setStatusError] = useState("");

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 180]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setLoading(false);
      launchConfetti(2500);
    }, 1000);
    return () => window.clearTimeout(t);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setSent(false);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      
      const data = {
        fullName: formData.get('fullName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string || undefined,
        willAttend: confirmacao === 'sim',
        numberOfGuests: confirmacao === 'sim' ? parseInt(formData.get('numberOfGuests') as string || '0') : 0,
        message: formData.get('message') as string || undefined,
      };

      const response = await apiService.submitConfirmation(data);

      // Resposta da API: { message: "...", rsvp: {...} }
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#7C5BA6", "#B39CD0", "#8FAA96", "#D4AF76", "#E8B4B8"],
      });

      setSent(true);
      (e.currentTarget as HTMLFormElement).reset();
      setConfirmacao("");
      setConsent(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar confirmação. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  async function checkStatus(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (checkingStatus) return;

    setCheckingStatus(true);
    setStatusError("");
    setStatusResult(null);

    try {
      const response = await apiService.checkConfirmation(checkEmail);
      setStatusResult(response);
    } catch (err: any) {
      setStatusError(err.message || 'Erro ao verificar status. Tente novamente.');
    } finally {
      setCheckingStatus(false);
    }
  }

  return (
    <Box sx={{ position: "relative" }}>
      <FloatingFlowers />

      {/* HERO */}
      <Box
        component="header"
        sx={{
          position: "relative",
          height: "100vh",
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            y: heroY,
            backgroundImage: 'url("https://i.imgur.com/3gc7G98.webp")',
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
          aria-hidden
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 30% 50%, rgba(212,175,118,0.22) 0%, transparent 50%)",
            animation: "pulse 8s ease-in-out infinite",
            "@keyframes pulse": { "0%,100%": { opacity: 0.3 }, "50%": { opacity: 0.6 } },
          }}
          aria-hidden
        />

        <Container sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 1.1, delay: 0.3 }}
              style={{
                height: 2,
                margin: "0 auto 30px",
                borderRadius: 2,
                background: "var(--gradient-sunset)",
              }}
            />
            <Typography
              component="h1"
              sx={{
                fontFamily: '"Tangerine", cursive',
                fontWeight: 700,
                fontSize: { xs: "5rem", sm: "6rem", md: "8rem" },
                color: "var(--white)",
                textShadow:
                  "2px 2px 4px rgba(0,0,0,0.3), 0 0 40px rgba(212,175,118,0.5)",
              }}
            >
              Samuel
              <motion.span
                style={{ display: "block", margin: "10px 0" }}
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                &
              </motion.span>
              Patrícia
            </Typography>

            <Typography
              sx={{
                mt: 2,
                fontSize: { xs: "1rem", md: "2rem" },
                fontWeight: 300,
                color: "var(--light-lavender)",
                letterSpacing: { xs: 2, md: 4 },
                textTransform: "uppercase",
              }}
            >
              17 de Maio de 2026
            </Typography>

            <Typography
              sx={{
                mt: 1,
                fontSize: { xs: "1rem", md: "1.5rem" },
                color: "var(--mint)",
                letterSpacing: 2,
              }}
            >
              Setúbal, Portugal
            </Typography>

            <Box sx={{ mt: 4 }}>
              <Button
                onClick={() => document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" })}
                variant="contained"
                sx={{
                  borderRadius: 999,
                  py: 1.6,
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  fontWeight: 700,
                  background: "var(--gradient-sunset)",
                  boxShadow: "0 8px 25px rgba(212,175,118,0.35)",
                  "&:hover": { background: "var(--gradient-sunset)", transform: "translateY(-2px)" },
                }}
              >
                Confirmar presença
              </Button>
            </Box>
          </motion.div>
        </Container>

        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            opacity: 0.8,
            zIndex: 2,
            fontSize: 28,
          }}
          aria-hidden
        >
          ⌄
        </motion.div>
      </Box>

      {/* WELCOME */}
      <Box sx={{ py: { xs: 10, md: 14 }, background: "var(--cream)", position: "relative", zIndex: 1 }}>
        <Container>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8 }}>
            <SectionTitle>Sejam Bem-Vindos!</SectionTitle>
            <Box
              sx={{
                maxWidth: 820,
                mx: "auto",
                mt: 6,
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: { xs: "1.3rem", md: "1.6rem" },
                  fontStyle: "italic",
                  color: "var(--text-dark)",
                  lineHeight: 1.8,
                  mb: 2,
                }}
              >
                "Contudo, além de todas estas coisas, revistam-se de amor, pois é o perfeito vínculo de união."
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: { xs: "1rem", md: "1.2rem" },
                  color: "var(--text-light)",
                  fontWeight: 600,
                }}
              >
                Colossenses 3:14
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* COUNTDOWN */}
      <Countdown />

      {/* EVENTS */}
      <Box sx={{ py: { xs: 10, md: 14 }, background: "var(--white)", position: "relative", zIndex: 1 }}>
        <Container>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8 }}>
            <SectionTitle>Nosso Grande Dia</SectionTitle>
          </motion.div>

          <Box
            sx={{
              mt: { xs: 6, md: 10 },
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
              gap: { xs: 4, md: 6 },
            }}
          >
            {/* CERIMÓNIA */}
            <motion.div whileHover={{ y: -14 }} transition={{ type: "spring", stiffness: 240, damping: 18 }}>
              <Card
                sx={{
                  borderRadius: "30px",
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
                  background: "linear-gradient(135deg, rgba(124,91,166,0.05) 0%, rgba(179,156,208,0.05) 100%)",
                }}
              >
                <Box sx={{ p: 4, textAlign: "center", background: "var(--gradient-primary)", position: "relative" }}>
                  <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", opacity: 0.12, fontSize: 120 }} aria-hidden>
                    ❀
                  </Box>
                  <Typography sx={{ fontSize: 50, position: "relative", zIndex: 1 }}>💍</Typography>
                  <Typography
                    sx={{
                      mt: 1,
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 700,
                      fontSize: { xs: "1.8rem", md: "2.5rem" },
                      color: "var(--white)",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    Cerimônia
                  </Typography>
                  <Typography sx={{ color: "var(--light-lavender)", position: "relative", zIndex: 1 }}>
                    17 de Maio de 2026 • Horário a confirmar
                  </Typography>
                </Box>

                <CardContent sx={{ p: 4 }}>
                  <Typography sx={{ fontWeight: 600, color: "var(--text-dark)" }}>
                    Salão do Reino das Testemunhas de Jeová
                  </Typography>
                  <Typography sx={{ mt: 1, color: "var(--text-light)" }}>
                    Estr. Montureiras Novas 36, 2910-619 Setúbal
                  </Typography>

                  <Box
                    sx={{
                      mt: 3,
                      borderRadius: "20px",
                      overflow: "hidden",
                      height: 300,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(124,91,166,0.2)",
                    }}
                  >
                    <iframe
                      title="Mapa Cerimónia"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3118.5!2d-8.8751648!3d38.5275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDMxJzM5LjAiTiA4wrA1MicyMi44Ilc!5e0!3m2!1spt-BR!2sbr!4v1727460000000"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </Box>

                  <Box sx={{ mt: 3, display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                    <Button
                      component="a"
                      href="https://www.google.com/maps/place/Estr.+Montureiras+Novas+36,+2910-619+Set%C3%BAbal,+Portugal"
                      target="_blank"
                      rel="noreferrer"
                      fullWidth
                      variant="contained"
                      sx={{
                        flex: "1 1 220px",
                        borderRadius: 999,
                        py: 1.6,
                        background: "var(--gradient-primary)",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        fontWeight: 700,
                        "&:hover": { background: "var(--gradient-primary)", transform: "translateY(-2px)" },
                      }}
                    >
                      <span style={{ marginRight: 8 }}>📍</span> Ver Direções
                    </Button>

                    <Button
                      onClick={() => addToCalendar("ceremony")}
                      fullWidth
                      variant="contained"
                      sx={{
                        flex: "1 1 220px",
                        borderRadius: 999,
                        py: 1.6,
                        background: "var(--gradient-sage)",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        fontWeight: 700,
                        "&:hover": { background: "var(--gradient-sage)", transform: "translateY(-2px)" },
                      }}
                    >
                      <span style={{ marginRight: 8 }}>📅</span> Adicionar à Agenda
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            {/* Copo-d'água */}
            <motion.div whileHover={{ y: -14 }} transition={{ type: "spring", stiffness: 240, damping: 18 }}>
              <Card
                sx={{
                  borderRadius: "30px",
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
                  background: "linear-gradient(135deg, rgba(124,91,166,0.05) 0%, rgba(179,156,208,0.05) 100%)",
                }}
              >
                <Box sx={{ p: 4, textAlign: "center", background: "var(--gradient-primary)", position: "relative" }}>
                  <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", opacity: 0.12, fontSize: 120 }} aria-hidden>
                    ❀
                  </Box>
                  <Typography sx={{ fontSize: 50, position: "relative", zIndex: 1 }}>🎉</Typography>
                  <Typography
                    sx={{
                      mt: 1,
                      fontFamily: '"Playfair Display", serif',
                      fontWeight: 700,
                      fontSize: { xs: "1.8rem", md: "2.5rem" },
                      color: "var(--white)",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    Recepção
                  </Typography>
                  <Typography sx={{ color: "var(--light-lavender)", position: "relative", zIndex: 1 }}>
                    17 de Maio de 2026 • Após a Cerimônia
                  </Typography>
                </Box>

                <CardContent sx={{ p: 4 }}>
                  <Typography sx={{ fontWeight: 600, color: "var(--text-dark)" }}>Quinta do Patrício</Typography>
                  <Typography sx={{ mt: 1, color: "var(--text-light)" }}>
                    Setúbal
                  </Typography>

                  <Box
                    sx={{
                      mt: 3,
                      borderRadius: "20px",
                      overflow: "hidden",
                      height: 300,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(124,91,166,0.2)",
                    }}
                  >
                    <iframe
                      title="Mapa Recepção"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d99518.60779291508!2d-8.9973384!3d38.5244269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1943644c764b35%3A0x2a0188d2e3eaae6!2sQuinta%20do%20Patr%C3%ADcio!5e0!3m2!1spt-PT!2spt!4v1736101234567!5m2!1spt-PT!2spt"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </Box>

                  <Box sx={{ mt: 3, display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                    <Button
                      component="a"
                      href="https://maps.app.goo.gl/BwVmgwHbzzBbvRVSA"
                      target="_blank"
                      rel="noreferrer"
                      fullWidth
                      variant="contained"
                      sx={{
                        flex: "1 1 220px",
                        borderRadius: 999,
                        py: 1.6,
                        background: "var(--gradient-primary)",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        fontWeight: 700,
                        "&:hover": { background: "var(--gradient-primary)", transform: "translateY(-2px)" },
                      }}
                    >
                      <span style={{ marginRight: 8 }}>📍</span> Ver Direções
                    </Button>

                    <Button
                      onClick={() => addToCalendar("party")}
                      fullWidth
                      variant="contained"
                      sx={{
                        flex: "1 1 220px",
                        borderRadius: 999,
                        py: 1.6,
                        background: "var(--gradient-sage)",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        fontWeight: 700,
                        "&:hover": { background: "var(--gradient-sage)", transform: "translateY(-2px)" },
                      }}
                    >
                      <span style={{ marginRight: 8 }}>📅</span> Adicionar à Agenda
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* PRESENTES / MBWAY */}
      <Box sx={{ py: { xs: 10, md: 14 }, background: "var(--white)", position: "relative" }}>
        <Container>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8 }}>
            <SectionTitle>Presentes</SectionTitle>
            
            <Box sx={{ maxWidth: 800, mx: "auto", mt: 6 }}>
              <Typography
                sx={{
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  color: "var(--text-light)",
                  lineHeight: 1.8,
                  textAlign: "center",
                  mb: 4,
                }}
              >
                Sua presença é o maior presente! Mas, se desejarem nos presentear, 
                ficaremos felizes em receber uma contribuição via MBway:
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 4,
                  mt: 4,
                }}
              >
                {/* Patrícia */}
                <Card
                  sx={{
                    p: 4,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, var(--light-lavender) 0%, rgba(255,255,255,0.9) 100%)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Tangerine", cursive',
                      fontSize: "2.5rem",
                      fontWeight: 700,
                      color: "var(--deep-purple)",
                      mb: 2,
                    }}
                  >
                    Patrícia
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1.3rem",
                      fontWeight: 600,
                      color: "var(--deep-purple)",
                      letterSpacing: 1,
                    }}
                  >
                    +351 931 740 492
                  </Typography>
                </Card>

                {/* Samuel */}
                <Card
                  sx={{
                    p: 4,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, var(--mint) 0%, rgba(255,255,255,0.9) 100%)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: '"Tangerine", cursive',
                      fontSize: "2.5rem",
                      fontWeight: 700,
                      color: "var(--deep-purple)",
                      mb: 2,
                    }}
                  >
                    Samuel
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1.3rem",
                      fontWeight: 600,
                      color: "var(--deep-purple)",
                      letterSpacing: 1,
                    }}
                  >
                    +351 933 245 603
                  </Typography>
                </Card>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* RSVP */}
      <Box
        id="rsvp"
        sx={{
          py: { xs: 10, md: 14 },
          background: "linear-gradient(135deg, var(--light-lavender) 0%, var(--mint) 100%)",
          position: "relative",
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            opacity: 0.12,
            fontSize: { xs: 90, md: 200 },
            letterSpacing: { xs: 20, md: 100 },
            whiteSpace: "nowrap",
          }}
          aria-hidden
        >
          ❀ ❀ ❀
        </Box>

        <Container sx={{ position: "relative" }}>
          <SectionTitle light>Confirmação de Presença</SectionTitle>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8 }}>
            <Box
              sx={{
                maxWidth: 720,
                mx: "auto",
                mt: 8,
                p: { xs: 3, md: 7 },
                borderRadius: { xs: 1, md: 1 },
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              }}
            >
              {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
                  {error}
                </Alert>
              )}
              
              {sent && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Confirmacao enviada com sucesso! Obrigado!
                </Alert>
              )}

              <Box component="form" onSubmit={onSubmit}>
                <Typography sx={{ fontWeight: 700, color: "var(--deep-purple)", mb: 1, letterSpacing: 1, textTransform: "uppercase" }}>
                  Nome Completo *
                </Typography>
                <TextField name="fullName" fullWidth required placeholder="Digite seu nome completo" sx={{ mb: 3 }} />

                <Typography sx={{ fontWeight: 700, color: "var(--deep-purple)", mb: 1, letterSpacing: 1, textTransform: "uppercase" }}>
                  Email *
                </Typography>
                <TextField name="email" fullWidth required type="email" placeholder="seu@email.com" sx={{ mb: 3 }} />

                <Typography sx={{ fontWeight: 700, color: "var(--deep-purple)", mb: 1, letterSpacing: 1, textTransform: "uppercase" }}>
                  Telefone
                </Typography>
                <TextField name="phone" fullWidth placeholder="+351 912 345 678" sx={{ mb: 3 }} />

                <Typography sx={{ fontWeight: 700, color: "var(--deep-purple)", mb: 1, letterSpacing: 1, textTransform: "uppercase" }}>
                  Você confirma sua presença? 
                </Typography>

                <FormControl fullWidth required sx={{ mb: 3 }}>
                  <InputLabel id="confirmacao-label">Selecione uma opção</InputLabel>
                  <Select
                    labelId="confirmacao-label"
                    label="Selecione uma opção"
                    value={confirmacao}
                    onChange={(e) => setConfirmacao(e.target.value as any)}
                  >
                    <MenuItem value="">
                      <em>Selecione uma opção</em>
                    </MenuItem>
                    <MenuItem value="sim">✓ Sim, eu vou!</MenuItem>
                    <MenuItem value="nao">✗ Infelizmente não poderei ir</MenuItem>
                  </Select>
                </FormControl>

                {confirmacao === "sim" && (
                  <>
                    <Typography sx={{ fontWeight: 700, color: "var(--deep-purple)", mb: 1, letterSpacing: 1, textTransform: "uppercase" }}>
                      Número de Acompanhantes
                    </Typography>
                    <TextField name="numberOfGuests" fullWidth type="number" inputProps={{ min: 0, max: 10 }} placeholder="0" sx={{ mb: 3 }} />
                  </>
                )}

                <Typography sx={{ fontWeight: 700, color: "var(--deep-purple)", mb: 1, letterSpacing: 1, textTransform: "uppercase" }}>
                  Deixe uma mensagem carinhosa (Opcional)
                </Typography>
                <TextField name="message" fullWidth multiline minRows={4} placeholder="Escreva uma mensagem especial para os noivos..." sx={{ mb: 3 }} />

                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      required
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: "0.9rem", color: "var(--text-light)" }}>
                      Concordo com o uso dos meus dados pessoais para fins de organização do casamento, conforme a LGPD 
                    </Typography>
                  }
                  sx={{ mb: 2, alignItems: "flex-start" }}
                />

                <Button
                  type="submit"
                  disabled={submitting || !consent}
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 1,
                    py: 2.2,
                    borderRadius: 3,
                    background: sent ? "var(--gradient-sage)" : "var(--gradient-sunset)",
                    boxShadow: "0 8px 25px rgba(212,175,118,0.4)",
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    fontWeight: 800,
                    "&:hover": { background: sent ? "var(--gradient-sage)" : "var(--gradient-sunset)", transform: "translateY(-2px)" },
                    "&:disabled": { opacity: 0.6 },
                  }}
                >
                  {submitting ? "Enviando…" : sent ? "Confirmação Enviada!" : "Confirmar Presença 💌"}
                </Button>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* CHECK STATUS SECTION */}
      <Box
        sx={{
          py: 10,
          background: "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)",
          position: "relative",
        }}
      >
        <Container sx={{ position: "relative" }}>
          <SectionTitle>Verificar Status da Confirmação</SectionTitle>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8 }}>
            <Box
              sx={{
                maxWidth: 600,
                mx: "auto",
                mt: 6,
                p: { xs: 3, md: 5 },
                borderRadius: 3,
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              }}
            >
              <Typography sx={{ mb: 3, color: "var(--text-light)", textAlign: "center" }}>
                Já enviou sua confirmação? Digite seu email abaixo para verificar o status.
              </Typography>

              {statusError && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setStatusError("")}>
                  {statusError}
                </Alert>
              )}

              {statusResult && (
                <Alert 
                  severity={
                    statusResult.exists === false ? "info" :
                    statusResult.status === "APPROVED" ? "success" :
                    statusResult.status === "REJECTED" ? "error" : "warning"
                  } 
                  sx={{ mb: 3 }}
                >
                  {statusResult.exists === false ? (
                    <Typography>Nenhuma confirmação encontrada com este email.</Typography>
                  ) : (
                    <>
                      <Typography sx={{ fontWeight: 600, mb: 1 }}>
                        Olá, {statusResult.name}!
                      </Typography>
                      <Typography>
                        Status da sua confirmação: {" "}
                        <strong>
                          {statusResult.status === "PENDING" && "⏳ Pendente de aprovação"}
                          {statusResult.status === "APPROVED" && "✅ Aprovada! Nos vemos no casamento!"}
                          {statusResult.status === "REJECTED" && "❌ Não aprovada"}
                        </strong>
                      </Typography>
                      <Typography sx={{ mt: 1, fontSize: "0.9rem" }}>
                        Enviado em: {new Date(statusResult.submittedAt).toLocaleDateString('pt-BR', { 
                          day: '2-digit', 
                          month: 'long', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </>
                  )}
                </Alert>
              )}

              <Box component="form" onSubmit={checkStatus}>
                <TextField
                  fullWidth
                  type="email"
                  required
                  value={checkEmail}
                  onChange={(e) => setCheckEmail(e.target.value)}
                  placeholder="seu@email.com"
                  label="Email"
                  sx={{ mb: 3 }}
                  disabled={checkingStatus}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={checkingStatus}
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    background: "var(--gradient-purple)",
                    color: "#2c2c2c",
                    boxShadow: "0 8px 25px rgba(124,91,166,0.3)",
                    textTransform: "uppercase",
                    letterSpacing: 1.5,
                    fontWeight: 700,
                    "&:hover": {
                      background: "linear-gradient(135deg, #8a68b8 0%, #c7b3e0 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 30px rgba(124,91,166,0.4)",
                    },
                    "&.Mui-disabled": {
                      color: "rgba(44, 44, 44, 0.5)",
                      background: "var(--gradient-purple)",
                      opacity: 0.7,
                    },
                  }}
                >
                  {checkingStatus ? "Verificando..." : "Verificar Status 🔍"}
                </Button>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          color: "#e0e0e0",
          py: 4,
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Container sx={{ maxWidth: 820 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            {/* Site Name */}
            <Typography
              sx={{
                fontSize: "0.9rem",
                color: "#b0b0b0",
                fontWeight: 500,
              }}
            >
              Samuel & Patrícia Wedding Site
            </Typography>

            {/* Developer Info */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  color: "#b0b0b0",
                }}
              >
                Desenvolvido por
              </Typography>
              <Box
                component="a"
                href="https://api.whatsapp.com/send?phone=351935559989&text=Vim%20pelo%20site%20da%20Patricia%20e%20do%20Samuel%20e%20gostaria%20de%20saber%20mais%20informa%C3%A7%C3%B5es%20sobre%20futuros%20projetos"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "#7C5BA6",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#B39CD0",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Typography component="span" sx={{ fontSize: "1rem" }}>
                  @bfrpaulondev
                </Typography>
                <Box
                  component="span"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    ml: 0.5,
                  }}
                >
                  📱
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Copyright */}
          <Typography
            sx={{
              mt: 2,
              fontSize: "0.75rem",
              color: "#b0b0b0",
              textAlign: "center",
            }}
          >
            © 2026 Todos os direitos reservados
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

