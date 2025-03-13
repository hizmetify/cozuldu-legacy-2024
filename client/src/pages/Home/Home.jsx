import Header from '../../components/Header/Header';
import { Helmet } from 'react-helmet-async';
import Hero from '../../components/Hero/Hero';
import CallToAction from '../../components/Hero/CTA';
import HowItWorks from '../../components/Hero/HowItWorks';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Çözüldü - Anasayfa</title>
        <meta
          name="description"
          content="Çözüldü platformunda ücretsiz bir şekilde istediğiniz hizmeti ve müşteri bulabilirsiniz."
        />
        <meta name="hizmet, freelance, kategori, yüz yüze" />
        <link rel="canonical" href="https://xn--zld-1la9esbc.com/" />
        <meta property="og:title" content="Hizmet Ver - Ana Sayfa" />
        <meta
          property="og:description"
          content="Çözüldü platformunda ücretsiz bir şekilde istediğiniz hizmeti ve müşteri bulabilirsiniz."
        />
        <meta property="og:url" content="https://xn--zld-1la9esbc.com/" />
      </Helmet>
      <Header />
      <Hero />
      <HowItWorks />
      <CallToAction />
    </>
  );
};

export default Home;
