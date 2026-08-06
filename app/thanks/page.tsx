import Link from "next/link";

export const metadata={title:"Спасибо за заявку — СМП МАРКО",robots:{index:false,follow:false}};

export default function ThanksPage(){return <main id="top" className="thanks-page"><div className="container thanks-card"><span>✓</span><div className="eyebrow"><i/>Заявка принята</div><h1>Спасибо! Мы получили ваши данные</h1><p>Инженер изучит заявку и свяжется с вами по указанному телефону. Файл проекта также сохранён вместе с заявкой.</p><div><Link className="button" href="/">Вернуться на главную</Link><Link className="text-link" href="/contacts">Контакты компании</Link></div></div></main>}
