import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Modal from "./Modal";
import "./PerfilHeader.css";

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
    if (isEditModalOpen) {
      // Separa o email para mostrar apenas o prefixo no input
      const emailPrefix = user.email ? user.email.split("@")[0] : "";

      setFormData({
        name: user.name || "",
        curso: user.curso || "",
        email: emailPrefix,
        senhaAtual: "",
        novaSenha: "",
        confirmarNovaSenha: "",
      });
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirmNew(false);
      setPasswordStrength(0); // Reseta a força ao abrir o modal
    }
  }, [isEditModalOpen, user]);

  // Lógica de Força de Senha (copiada de NovaSenha.js)
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

  // Determina a classe CSS com base na força (APENAS RETORNA CLASSE - SEM COR AQUI)
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
  // Fim da Lógica de Força de Senha

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Atualiza a força da senha apenas para o campo "novaSenha"
    if (name === "novaSenha") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (formData.novaSenha || formData.senhaAtual) {
      if (!formData.senhaAtual) {
        toast.error("Para alterar a senha, informe a senha atual.");
        return;
      }

      const passwordError = validatePassword(formData.novaSenha);
      if (passwordError) {
        toast.error(`Nova Senha: ${passwordError}`);
        return;
      }

      if (formData.novaSenha !== formData.confirmarNovaSenha) {
        toast.error("A nova senha e a confirmação não conferem.");
        return;
      }
    }

    // LÓGICA DO EMAIL COMPLETO PARA SALVAR
    const emailCompleto = `${formData.email}@souunit.com.br`;

    const dataToSave = {
      ...formData,
      email: emailCompleto,
    };

    console.log("Dados salvos:", dataToSave);

    // AQUI VOCÊ FARIA O FETCH PARA ATUALIZAR O USUÁRIO (PUT)
    // await fetch(...)

    toast.success("Perfil atualizado com sucesso!");
    setIsEditModalOpen(false);
  };

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
          <img src={user.avatar} alt={user.name} className="perfil-avatar" />
          <div className="perfil-info-text">
            <h1 className="perfil-name">{user.name}</h1>
            <p className="perfil-curso">{user.curso}</p>
            <div className="perfil-stats">
              <span className="stat-item">
                &#128214; {user.livrosDisponiveis} Livros
              </span>
              <span className="stat-item">
                &#8644; {user.tradeCount} Trocados
              </span>
              <span className="stat-item">
                &#127942; {user.conquistaCount} Conquistas
              </span>
              <span className="stat-item">&#9733; {user.rating}</span>
            </div>
          </div>
          <div className="perfil-info-actions"></div>
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

          {/* CAMPO DE EMAIL COM DOMÍNIO FIXO */}
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

              {/* Barra de Força da Senha para Nova Senha */}
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

          {/* Requisitos de Senha */}
          <div className="form-footer modal-footer">
            <p className="form-help-text">
              A nova senha deve conter:
              <ul className="password-requirements modal-requirements">
                <li>✓ Pelo menos 6 caracteres</li>
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
