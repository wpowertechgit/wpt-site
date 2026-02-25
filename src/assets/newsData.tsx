import { useTranslation } from 'react-i18next';

export const useNewsData = () => {
  const { t } = useTranslation();

  const newsArray = [
    {
      id: 8,
      title: t('news8.title'),
      paragraph: t('news8.paragraph'),
      image: './news8.jpg',
      link: 'https://stirileprotv.ro/stiri/actualitate/o-instalatie-din-cluj-ar-putea-alimenta-orasul-in-caz-de-avarie-deseurile-pot-fi-transformate-in-electricitate-si-caldura.html',
    },
    {
      id: 7,
      title: t('news7.title'),
      paragraph: t('news7.paragraph'),
      image: './news7.jpg',
      link: 'https://cjcluj.ro/in-premiera-nationala-absoluta-consiliul-judetean-cluj-transforma-deseurile-in-energie-verde-si-in-final-in-bani-pentru-clujeni/',
    },
    {
      id: 6,
      title: t('news6.title'),
      paragraph: t('news6.paragraph'),
      image: './news6.png',
      link: 'https://cjcluj.ro/lucrarile-de-construire-a-statiei-de-dezintegrare-moleculara-inregistreaza-un-progres-de-cca-80/',
    },
    {
      id: 5,
      title: t('news5.title'),
      paragraph: t('news5.paragraph'),
      image: './news5.jpg',
      link: 'https://napocalive.ro/administrativ/ministrul-energiei-vom-sustine-extinderea-la-nivel-national-a-proiectului-de-dezintegrare-moleculara-al-consiliului-judetean-cluj',
    },
    {
      id: 4,
      title: t('news4.title'),
      paragraph: t('news4.paragraph'),
      image: './news4.png',
      link: 'https://cjcluj.ro/un-nou-pas-important-in-vederea-transformarii-deseurilor-in-energie/',
    },
    {
      id: 1,
      title: t('news1.title'),
      paragraph: t('news1.paragraph'),
      image: './news1.jpg',
      link: 'https://www.transilvaniabusiness.ro/2024/05/08/waste-powertech-va-furniza-clujului-o-statie-de-dezintegrare-moleculara/',
    },
    {
      id: 2,
      title: t('news2.title'),
      paragraph: t('news2.paragraph'),
      image: './news2.png',
      link: 'https://cjcluj.ro/a-fost-semnat-contractul-de-achizitie-a-primei-instalatii-de-tratare-prin-dezintegrare-moleculara-a-deseurilor-municipale-de-pe-teritoriul-judetului-cluj/',
    },
    {
      id: 3,
      title: t('news3.title'),
      paragraph: t('news3.paragraph'),
      image: './news3.jpg',
      link: 'https://maszol.ro/belfold/Energiat-termelnek-a-szemetbol-61-millio-lejes-beruhazasbol-epit-modern-hulladekkezelot-a-Kolozs-Megyei-Tanacs',
    },
  ];

  return [...newsArray].sort((a, b) => b.id - a.id);
};
