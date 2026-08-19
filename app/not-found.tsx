import Link from "next/link";

export default function NotFound() {
  return <main id="top" className="not-found-page"><div className="container not-found-card"><span>404</span><div className="section-index">Страница не найдена</div><h1>Такой страницы нет</h1><p>Возможно, адрес изменился или в ссылке допущена ошибка. Вернитесь на главную страницу или перейдите к услугам.</p><div><Link className="button" href="/">На главную</Link><Link className="text-link" href="/services">Смотреть услуги →</Link></div></div></main>;
}
