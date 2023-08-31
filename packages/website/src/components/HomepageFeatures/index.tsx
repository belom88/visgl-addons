import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

type FeatureItem = {
  title: string;
  url: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Compatibility',
    url: '/img/puzzle.webp',
    description: <>Use it with Maplibre, Mapbox, Google Maps or ArcGIS</>,
  },
  {
    title: 'Performance oriented',
    url: '/img/chip.webp',
    description: (
      <>
        The layer is supplied with built-in 3D models that have proven
        perfomance. It can be visualized with 2000 animated vehicles or 100000
        static
      </>
    ),
  },
  {
    title: 'Powered by deck.gl',
    url: '/img/deckgl.webp',
    description: (
      <>
        The layer works as part of <a href="https://deck.gl">deck.gl</a>{' '}
        framework that is oriented on highly perfomant data visualization
      </>
    ),
  },
];

function Feature({ title, url, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={useBaseUrl(url)} className={styles.featureImg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
