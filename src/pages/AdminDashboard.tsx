import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Delete,
  Logout,
  Refresh,
  PeopleAlt,
  EventAvailable,
  Pending,
  ThumbUp,
  ThumbDown,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

interface Confirmation {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  willAttend: boolean;
  guests: number;
  message?: string;
  dietaryRestrictions?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  totalConfirmations: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  willAttendCount: number;
  wontAttendCount: number;
  totalGuests: number;
}

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const [tab, setTab] = useState(0);
  const [confirmations, setConfirmations] = useState<Confirmation[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedConfirmation, setSelectedConfirmation] = useState<Confirmation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const statusMap = ['all', 'PENDING', 'APPROVED', 'REJECTED'];

  useEffect(() => {
    loadData();
  }, [tab]);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const [confirmationsRes, statsRes] = await Promise.all([
        apiService.getConfirmations({ status: statusMap[tab] === 'all' ? undefined : statusMap[tab] }),
        apiService.getStats(),
      ]);

      if (confirmationsRes.rsvps) {
        setConfirmations(confirmationsRes.rsvps);
      }

      if (statsRes) {
        setStats(statsRes);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await apiService.approveConfirmation(id);
      loadData();
      setDialogOpen(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao aprovar');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await apiService.rejectConfirmation(id);
      loadData();
      setDialogOpen(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao rejeitar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja deletar esta confirmação?')) {
      return;
    }

    try {
      await apiService.deleteConfirmation(id);
      loadData();
      setDialogOpen(false);
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Aprovado';
      case 'REJECTED':
        return 'Rejeitado';
      default:
        return 'Pendente';
    }
  };

  const getAttendanceLabel = (willAttend: boolean) => {
    return willAttend ? 'Sim' : 'Não';
  };

  const getAttendanceColor = (willAttend: boolean) => {
    return willAttend ? 'success' : 'error';
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #7C5BA6 0%, #B39CD0 100%)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: '"Playfair Display", serif' }}>
            Painel de Administração - Casamento Samuel & Patrícia
          </Typography>
          <Typography sx={{ mr: 2 }}>Olá, {admin?.name}!</Typography>
          <Button color="inherit" startIcon={<Logout />} onClick={logout}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Estatísticas */}
        {stats && (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 4 }}>
            <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {stats.totalConfirmations}
                    </Typography>
                    <Typography>Total de Confirmações</Typography>
                  </Box>
                  <PeopleAlt sx={{ fontSize: 50, opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {stats.pendingCount}
                    </Typography>
                    <Typography>Pendentes</Typography>
                  </Box>
                  <Pending sx={{ fontSize: 50, opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {stats.approvedCount}
                    </Typography>
                    <Typography>Aprovados</Typography>
                  </Box>
                  <ThumbUp sx={{ fontSize: 50, opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {stats.totalGuests}
                    </Typography>
                    <Typography>Total de Convidados</Typography>
                  </Box>
                  <EventAvailable sx={{ fontSize: 50, opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Tabs e Tabela */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
            <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
              <Tab label="Todas" />
              <Tab label="Pendentes" />
              <Tab label="Aprovadas" />
              <Tab label="Rejeitadas" />
            </Tabs>
            <Button startIcon={<Refresh />} onClick={loadData} disabled={loading}>
              Atualizar
            </Button>
          </Box>

          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : confirmations.length === 0 ? (
              <Typography sx={{ textAlign: 'center', py: 4, color: '#666' }}>
                Nenhuma confirmação encontrada
              </Typography>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: '#f5f5f5' }}>
                      <TableCell><strong>Nome</strong></TableCell>
                      <TableCell><strong>Email</strong></TableCell>
                      <TableCell><strong>Telefone</strong></TableCell>
                      <TableCell align="center"><strong>Presença</strong></TableCell>
                      <TableCell align="center"><strong>Convidados</strong></TableCell>
                      <TableCell align="center"><strong>Status</strong></TableCell>
                      <TableCell align="center"><strong>Data</strong></TableCell>
                      <TableCell align="center"><strong>Ações</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {confirmations.map((confirmation) => (
                      <TableRow key={confirmation._id} hover>
                        <TableCell>{confirmation.fullName}</TableCell>
                        <TableCell>{confirmation.email}</TableCell>
                        <TableCell>{confirmation.phone || '-'}</TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={getAttendanceLabel(confirmation.willAttend)} 
                            color={getAttendanceColor(confirmation.willAttend) as any} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell align="center">{confirmation.guests}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={getStatusLabel(confirmation.status)}
                            color={getStatusColor(confirmation.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          {new Date(confirmation.createdAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                              setSelectedConfirmation(confirmation);
                              setDialogOpen(true);
                            }}
                          >
                            <CheckCircle />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Dialog de Detalhes */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        {selectedConfirmation && (
          <>
            <DialogTitle sx={{ background: 'linear-gradient(135deg, #7C5BA6 0%, #B39CD0 100%)', color: 'white' }}>
              Detalhes da Confirmação
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">Nome Completo</Typography>
                <Typography variant="body1" fontWeight={600}>{selectedConfirmation.fullName}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                <Typography variant="body1">{selectedConfirmation.email}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">Telefone</Typography>
                <Typography variant="body1">{selectedConfirmation.phone || 'Não informado'}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">Confirmou Presença</Typography>
                <Chip 
                  label={getAttendanceLabel(selectedConfirmation.willAttend)} 
                  color={getAttendanceColor(selectedConfirmation.willAttend) as any} 
                  sx={{ mt: 1 }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">Número de Convidados</Typography>
                <Typography variant="body1">{selectedConfirmation.guests}</Typography>
              </Box>

              {selectedConfirmation.dietaryRestrictions && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">Restrições Alimentares</Typography>
                  <Typography variant="body1">{selectedConfirmation.dietaryRestrictions}</Typography>
                </Box>
              )}

              {selectedConfirmation.message && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">Mensagem</Typography>
                  <Paper sx={{ p: 2, mt: 1, background: '#f5f5f5' }}>
                    <Typography variant="body2">{selectedConfirmation.message}</Typography>
                  </Paper>
                </Box>
              )}

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                <Chip
                  label={getStatusLabel(selectedConfirmation.status)}
                  color={getStatusColor(selectedConfirmation.status) as any}
                  sx={{ mt: 1 }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">Data de Envio</Typography>
                <Typography variant="body2">
                  {new Date(selectedConfirmation.createdAt).toLocaleString('pt-BR')}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">Última Atualização</Typography>
                <Typography variant="body2">
                  {new Date(selectedConfirmation.updatedAt).toLocaleString('pt-BR')}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button
                startIcon={<Delete />}
                color="error"
                onClick={() => handleDelete(selectedConfirmation._id)}
              >
                Deletar
              </Button>
              <Box sx={{ flex: 1 }} />
              {selectedConfirmation.status !== 'REJECTED' && (
                <Button
                  startIcon={<Cancel />}
                  color="warning"
                  variant="outlined"
                  onClick={() => handleReject(selectedConfirmation._id)}
                >
                  Rejeitar
                </Button>
              )}
              {selectedConfirmation.status !== 'APPROVED' && (
                <Button
                  startIcon={<CheckCircle />}
                  color="success"
                  variant="contained"
                  onClick={() => handleApprove(selectedConfirmation._id)}
                >
                  Aprovar
                </Button>
              )}
              <Button onClick={() => setDialogOpen(false)}>Fechar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
