import React from "react";
import "./Sobre.css";

export default function Sobre() {
  return (
    <main className="sobre-main">
      <section className="sobre-hero">
        <h1 className="sobre-hero-title">SOBRE</h1>
        <h2 className="sobre-hero-subtitle">Bem-Vindo ao UniLivros!</h2>
      </section>

      <section className="sobre-section">
        <p className="sobre-section-text">
          UniLivros nasceu do desejo de transformar o ato de ler em uma
          experiência compartilhada. Acreditamos que ler é mais do que virar
          páginas, é mergulhar em mundos, viver novas vidas e construir pontes
          entre pessoas que amam histórias. Aqui, você pode montar sua própria
          estante virtual, trocar livros com outros leitores e descobrir novas
          obras que talvez mudem o seu jeito de ver o mundo. Cada livro trocado,
          cada conversa iniciada, é uma oportunidade de criar uma nova
          narrativa, a sua. Mais do que uma plataforma, o UniLivros é uma
          comunidade de leitores, feita por pessoas que acreditam no poder da
          literatura para unir, inspirar e transformar.
        </p>
      </section>

      <section className="sobre-section">
        <h3 className="sobre-section-title">Nossa Missão</h3>
        <p className="sobre-section-text">
          Nossa missão é simples: conectar estudantes apaixonados por leitura.
          Acreditamos que cada livro merece ser lido por várias pessoas e que o
          conhecimento deve circular. O UniLivros é a ponte que torna isso
          possível dentro da nossa comunidade acadêmica.
        </p>
      </section>

      <section className="sobre-section">
        <h3 className="sobre-section-title">O que nos Move</h3>
        <p className="sobre-section-text">
          Somos movidos pela crença na sustentabilidade e na economia
          compartilhada. Por que deixar um livro parado na estante quando ele
          pode transformar a perspectiva de outra pessoa? Facilitamos a troca,
          incentivamos a leitura e ajudamos o meio ambiente, um livro de cada
          vez.
        </p>
      </section>

      <section className="sobre-section">
        <h3 className="sobre-section-title">Nossos Valores</h3>
        <p className="sobre-section-text">
          <strong>Comunidade:</strong> Somos feitos por estudantes, para
          estudantes.
          <br />
          <strong>Confiança:</strong> Criamos um ambiente seguro para trocas
          honestas.
          <br />
          <strong>Conhecimento:</strong> Acreditamos no poder dos livros para
          transformar.
        </p>
      </section>
    </main>
  );
}
