import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Modal from "./Modal";
import "./PerfilHeader.css";

export default function PerfilHeader({ user, activeTab, setActiveTab }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Estado para o formulário
  const [formData, setFormData] = useState({
    name: "",
    curso: "",
    email: "", // Supondo que exista, ou o usuário possa adicionar
    senhaAtual: "",
    novaSenha: "",
    confirmarNovaSenha: "",
  });

  // Preenche o formulário com os dados atuais quando o modal abre
  useEffect(() => {
    if (isEditModalOpen) {
      setFormData({
        name: user.name || "",
        curso: user.curso || "",
        email: "jonatas.lopes@souunit.com.br", // Mock, já que não veio na prop user
        senhaAtual: "",
        novaSenha: "",
        confirmarNovaSenha: "",
      });
    }
  }, [isEditModalOpen, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Validação simples de senha
    if (formData.novaSenha || formData.senhaAtual) {
      if (!formData.senhaAtual) {
        toast.error("Para alterar a senha, informe a senha atual.");
        return;
      }
      if (formData.novaSenha !== formData.confirmarNovaSenha) {
        toast.error("A nova senha e a confirmação não conferem.");
        return;
      }
      if (formData.novaSenha.length < 6) {
        toast.error("A nova senha deve ter pelo menos 6 caracteres.");
        return;
      }
    }

    console.log("Dados salvos:", formData);
    toast.success("Perfil atualizado com sucesso!");
    setIsEditModalOpen(false);
  };

  return (
    <>
      <section className="perfil-header-card">
        {/* Botão de Editar no Topo Direito */}
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

      {/* Modal de Edição */}
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
          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="edit-divider"></div>

          <h3 className="edit-section-title">Alterar Senha</h3>
          <div className="form-group">
            <label>Senha Atual</label>
            <input
              type="password"
              name="senhaAtual"
              value={formData.senhaAtual}
              onChange={handleInputChange}
              placeholder="Preencha apenas se for alterar"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Nova Senha</label>
              <input
                type="password"
                name="novaSenha"
                value={formData.novaSenha}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Repetir Nova Senha</label>
              <input
                type="password"
                name="confirmarNovaSenha"
                value={formData.confirmarNovaSenha}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="edit-modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              Salvar Alterações
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
