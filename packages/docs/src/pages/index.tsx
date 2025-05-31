import React from 'react';
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
// import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Get Started - 5min ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

function CodeExample() {
  return (
    <div className={styles.codeExample}>
      <div className="container">
        <h2 className={styles.codeExampleTitle}>One Router, Cross Platform</h2>
        <div className={styles.codeExampleContent}>
          <div className={styles.codeExampleTabs}>
            <div className={styles.codeExampleTab}>
              <h3>Express</h3>
              <pre>
                <code>{`import { PlatformManager, ExpressPlatform } from '@albasyir/platform-manager';
import express from 'express';

const app = express();
const platform = new PlatformManager({
  http: new ExpressPlatform({ reuseInstance: app })
});

const router = platform.router;
router.get('/', () => 'Hello World!');

await platform.start(3000);`}</code>
              </pre>
            </div>
            <div className={styles.codeExampleTab}>
              <h3>Fastify</h3>
              <pre>
                <code>{`import { PlatformManager, FastifyPlatform } from '@albasyir/platform-manager';
import fastify from 'fastify';

const app = fastify();
const platform = new PlatformManager({
  http: new FastifyPlatform({ reuseInstance: app })
});

const router = platform.router;
router.get('/', () => 'Hello World!');

await platform.start(3000);`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Benefits() {
  return (
    <div className={styles.benefits}>
      <div className="container">
        <h2 className={styles.benefitsTitle}>Why Choose UEP?</h2>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🚀</div>
            <h3>Platform Agnostic</h3>
            <p>Write your routes once and run them on any supported platform without changing your code.</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>⚡</div>
            <h3>High Performance</h3>
            <p>Built on top of high-performance HTTP servers like Express and Fastify.</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🛠️</div>
            <h3>Developer Experience</h3>
            <p>Clean API, TypeScript support, and excellent documentation.</p>
          </div>
          <div className={styles.benefitCard}>
            <div className={styles.benefitIcon}>🔌</div>
            <h3>Extensible</h3>
            <p>Easy to extend with new platforms and features.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RuntimeSupport() {
  return (
    <div className={styles.runtimeSupport}>
      <div className="container">
        <h2 className={styles.runtimeTitle}>Run Anywhere</h2>
        <p className={styles.runtimeSubtitle}>Choose your favorite runtime environment</p>
        <div className={styles.runtimeGrid}>
          <div className={styles.runtimeCard}>
            <div className={styles.runtimeIcon}>
              <img src="/img/nodejs-logo.svg" alt="Node.js" />
            </div>
            <h3>Node.js</h3>
            <p>Fully tested and production-ready</p>
          </div>
          <div className={styles.runtimeCard}>
            <div className={styles.runtimeIcon}>
              <img src="/img/bun-logo.svg" alt="Bun" />
            </div>
            <h3>Bun</h3>
            <p>Lightning fast with native support</p>
          </div>
          <div className={styles.runtimeCard}>
            <div className={styles.runtimeIcon}>
              <img src="/img/deno-logo.png" alt="Deno" />
            </div>
            <h3>Deno</h3>
            <p>Secure by default with TypeScript</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Unified API for Express, Fastify, and More - One Router, Cross Platform">
      <HomepageHeader />
      <main>
        {/* <HomepageFeatures /> */}
        <CodeExample />
        <Benefits />
        <RuntimeSupport />
      </main>
    </Layout>
  );
}
