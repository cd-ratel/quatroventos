import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={styles.footerBrand}>
          <div className={styles.footerLogo}>
            Quatro <span className={styles.footerLogoAccent}>Ventos</span>
          </div>
          <p className={styles.footerDesc}>
            O espaço perfeito para celebrar os momentos mais especiais da sua vida.
            Casamentos, festas infantis, reuniões corporativas e muito mais.
          </p>
          <div className={styles.footerSocial}>
            <a href="#" className={styles.socialLink} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              IG
            </a>
            <a href="#" className={styles.socialLink} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              FB
            </a>
            <a href="#" className={styles.socialLink} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
              WA
            </a>
          </div>
        </div>

        <div className={styles.footerColumn}>
          <h4>Navegação</h4>
          <ul className={styles.footerLinks}>
            <li><Link href="/" className={styles.footerLink}>Início</Link></li>
            <li><Link href="/espacos" className={styles.footerLink}>Espaços</Link></li>
            <li><Link href="/galeria" className={styles.footerLink}>Galeria</Link></li>
            <li><Link href="/agendar" className={styles.footerLink}>Agendar Visita</Link></li>
            <li><Link href="/contato" className={styles.footerLink}>Contato</Link></li>
          </ul>
        </div>

        <div className={styles.footerColumn}>
          <h4>Eventos</h4>
          <ul className={styles.footerLinks}>
            <li><Link href="/espacos" className={styles.footerLink}>Casamentos</Link></li>
            <li><Link href="/espacos" className={styles.footerLink}>Festas Infantis</Link></li>
            <li><Link href="/espacos" className={styles.footerLink}>Reuniões</Link></li>
            <li><Link href="/espacos" className={styles.footerLink}>Confraternizações</Link></li>
            <li><Link href="/espacos" className={styles.footerLink}>Eventos Corporativos</Link></li>
          </ul>
        </div>

        <div className={styles.footerColumn}>
          <h4>Contato</h4>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>📍</span>
            <span>Rua Exemplo, 123<br />Centro - Cidade/UF</span>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>📞</span>
            <span>(00) 00000-0000</span>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactIcon}>✉️</span>
            <span>contato@quatroventos.com.br</span>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p className={styles.copyright}>
          © {year} Quatro Ventos. Todos os direitos reservados.
        </p>
        <p className={styles.footerCredits}>
          Feito com ❤️ para momentos inesquecíveis
        </p>
      </div>
    </footer>
  );
}
