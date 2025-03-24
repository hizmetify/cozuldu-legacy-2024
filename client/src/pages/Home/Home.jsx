import Hero from '../../components/Hero/Hero';
import CallToAction from '../../components/Hero/CTA';
import HowItWorks from '../../components/Hero/HowItWorks';
import MetaHelmet from '../../utils/MetaHelmet';

const Home = () => {
  return (
    <>
      <MetaHelmet
        title="Anasayfa"
        description="Hizmetify platformunda ücretsiz bir şekilde istediğiniz hizmeti ve müşteri bulabilirsiniz."
        keywords="hizmet, freelance, kategori, yüz yüze"
        canonical="https://xn--zld-1la9esbc.com/"
        ogImage="https://xn--zld-1la9esbc.com/og-image.jpg"
      />
      <Hero />
      <HowItWorks />
      <CallToAction />
    </>
  );
};

export default Home;
