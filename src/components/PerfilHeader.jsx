import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaCamera } from "react-icons/fa"; // Adicionado FaCamera
import Modal from "./Modal";
import "./PerfilHeader.css";
import { API_BASE_URL } from "../services/api";

export default function PerfilHeader({ user, activeTab, setActiveTab }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirmNew, setShowConfirmNew] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    curso: "",
    email: "",
    senhaAtual: "",
    novaSenha: "",
    confirmarNovaSenha: "",
  });

  useEffect(() => {
    if (isEditModalOpen && user) {
      const emailPrefix = user.email ? user.email.split("@")[0] : "";
      setFormData({
        name: user.name || user.nome || "",
        curso: user.curso || "",
        email: emailPrefix,
        senhaAtual: "",
        novaSenha: "",
        confirmarNovaSenha: "",
      });
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirmNew(false);
      setPasswordStrength(0);
    }
  }, [isEditModalOpen, user]);

  // --- LÓGICA DE UPLOAD DE AVATAR (NOVO) ---
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validação simples de tamanho (ex: máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.warn("A imagem deve ter no máximo 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      // Upload imediato ao selecionar a foto
      const response = await fetch(
        `${API_BASE_URL}/usuarios/${user.id}/avatar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Nota: Não definimos Content-Type aqui, o navegador define multipart/form-data automaticamente com o boundary correto
          },
          body: formData,
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();

        // Atualiza o localStorage com a nova URL da foto
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const newUserState = {
          ...storedUser,
          avatarUrl: updatedUser.avatarUrl,
        };
        localStorage.setItem("user", JSON.stringify(newUserState));

        toast.success("Foto de perfil atualizada!");

        // Recarrega para atualizar a imagem em todos os lugares (header, sidebar, etc)
        window.location.reload();
      } else {
        toast.error("Erro ao enviar imagem.");
      }
    } catch (error) {
      console.error("Erro upload avatar:", error);
      toast.error("Erro de conexão ao enviar imagem.");
    }
  };
  // -----------------------------------------

  const validatePassword = (password) => {
    if (password.length < 6) return "A senha deve ter pelo menos 6 caracteres";
    if (!/[A-Z]/.test(password)) return "Inclua pelo menos uma letra maiúscula";
    if (!/[0-9]/.test(password)) return "Inclua pelo menos um número";
    return null;
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getStrengthClass = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength < 50) return "weak";
    if (passwordStrength < 75) return "medium";
    return "strong";
  };

  const getStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength < 50) return "Fraca";
    if (passwordStrength < 75) return "Média";
    return "Forte";
  };

  const getStrengthColor = () => {
    if (passwordStrength < 50) return "#ff4444";
    if (passwordStrength < 75) return "#ffbb33";
    return "#00C851";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "novaSenha") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      console.error(
        "ERRO CRÍTICO: ID do usuário não encontrado no objeto 'user'.",
        user
      );
      toast.error("Erro de identificação do usuário. Faça login novamente.");
      return;
    }

    let senhaParaEnvio = null;

    if (formData.novaSenha && formData.novaSenha.trim() !== "") {
      const passwordError = validatePassword(formData.novaSenha);
      if (passwordError) {
        toast.error(`Nova Senha: ${passwordError}`);
        return;
      }

      if (formData.novaSenha !== formData.confirmarNovaSenha) {
        toast.error("A nova senha e a confirmação não conferem.");
        return;
      }
      senhaParaEnvio = formData.novaSenha;
    }

    const emailCompleto = `${formData.email}@souunit.com.br`;

    const dataToSave = {
      nome: formData.name,
      curso: formData.curso,
      email: emailCompleto,
      matricula: user.matricula,
      semestre: user.semestre,
      ...(senhaParaEnvio && { senha: senhaParaEnvio }),
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/usuarios/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        const usuarioAtualizado = await response.json();

        // Mantém a foto antiga caso a API não retorne no PUT, ou usa a nova
        const currentAvatar = user.avatarUrl;
        const userLocalStorage = {
          ...user,
          ...usuarioAtualizado,
          avatarUrl: usuarioAtualizado.avatarUrl || currentAvatar,
        };

        localStorage.setItem("user", JSON.stringify(userLocalStorage));
        toast.success("Perfil atualizado com sucesso!");
        setIsEditModalOpen(false);
        window.location.reload();
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "Erro ao atualizar perfil.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error("Erro de conexão com o servidor.");
    }
  };

  // Define a imagem a ser mostrada (Base64 do banco ou placeholder)
  const avatarImage =
    user.avatarUrl || "https://via.placeholder.com/150?text=Foto";

  return (
    <>
      <section className="perfil-header-card">
        <button
          className="perfil-edit-btn"
          onClick={() => setIsEditModalOpen(true)}
          title="Editar Perfil"
        >
          &#9998;
        </button>

        <div className="perfil-info-main">
          <img src={avatarImage} alt={user.name} className="perfil-avatar" />
          <div className="perfil-info-text">
            <h1 className="perfil-name">{user.name || user.nome}</h1>
            <p className="perfil-curso">{user.curso}</p>
            <div className="perfil-stats">
              <span className="stat-item">
                &#128214; {user.livrosDisponiveis || 0} Livros
              </span>
              <span className="stat-item">
                &#8644; {user.tradeCount || user.totalTrocas || 0} Trocados
              </span>
              <span className="stat-item">
                &#127942; {user.conquistaCount || 0} Conquistas
              </span>
              <span className="stat-item">
                &#9733; {user.rating || user.avaliacao || 5.0}
              </span>
            </div>
          </div>
        </div>

        <nav className="perfil-nav-tabs">
          <button
            className={`perfil-tab-btn ${
              activeTab === "estante" ? "active" : ""
            }`}
            onClick={() => setActiveTab("estante")}
          >
            &#128214;
          </button>
          <button
            className={`perfil-tab-btn ${
              activeTab === "avaliacoes" ? "active" : ""
            }`}
            onClick={() => setActiveTab("avaliacoes")}
          >
            &#128172;
          </button>
          <button
            className={`perfil-tab-btn ${
              activeTab === "conquistas" ? "active" : ""
            }`}
            onClick={() => setActiveTab("conquistas")}
          >
            &#127942;
          </button>
        </nav>
      </section>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2 className="edit-modal-title">Editar Perfil</h2>

        {/* --- ÁREA DE UPLOAD DE FOTO --- */}
        <div className="edit-avatar-section">
          <div className="avatar-upload-wrapper">
            <img src={avatarImage} alt="Preview" className="avatar-preview" />
            <label
              htmlFor="avatar-upload"
              className="avatar-upload-label"
              title="Alterar foto"
            >
              <FaCamera />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }} // Esconde o input original
            />
          </div>
        </div>
        {/* ----------------------------- */}

        <form className="edit-profile-form" onSubmit={handleSave}>
          <h3 className="edit-section-title">Dados Pessoais</h3>
          <div className="form-group">
            <label>Nome Completo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Curso</label>
            <input
              type="text"
              name="curso"
              value={formData.curso}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>E-mail</label>
            <div className="edit-email-row">
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <span className="edit-email-domain">@souunit.com.br</span>
            </div>
          </div>

          <div className="edit-divider"></div>

          <h3 className="edit-section-title">Alterar Senha</h3>

          <div className="form-group">
            <label>Senha Atual</label>
            <div className="edit-password-wrapper">
              <input
                type={showCurrent ? "text" : "password"}
                name="senhaAtual"
                value={formData.senhaAtual}
                onChange={handleInputChange}
                placeholder="Preencha apenas se for alterar"
              />
              <button
                type="button"
                className="edit-password-toggle"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nova Senha</label>
              <div className="edit-password-wrapper">
                <input
                  type={showNew ? "text" : "password"}
                  name="novaSenha"
                  value={formData.novaSenha}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="edit-password-toggle"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {formData.novaSenha && (
                <div
                  className={`password-strength modal-strength ${getStrengthClass()}`}
                >
                  <div
                    className="strength-bar"
                    style={{
                      width: `${passwordStrength}%`,
                      backgroundColor: getStrengthColor(),
                    }}
                  ></div>
                  <div className="strength-text">
                    Força: {getStrengthText()}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Repetir Nova Senha</label>
              <div className="edit-password-wrapper">
                <input
                  type={showConfirmNew ? "text" : "password"}
                  name="confirmarNovaSenha"
                  value={formData.confirmarNovaSenha}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="edit-password-toggle"
                  onClick={() => setShowConfirmNew(!showConfirmNew)}
                >
                  {showConfirmNew ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          <div className="form-footer modal-footer">
            <p className="form-help-text">
              A nova senha deve conter:
              <ul className="password-requirements modal-requirements">
                <li>✓ Pelo menos 8 caracteres</li>
                <li>✓ Pelo menos uma letra maiúscula</li>
                <li>✓ Pelo menos um número</li>
              </ul>
            </p>
          </div>

          <div className="edit-modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={formData.novaSenha && passwordStrength < 50}
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
