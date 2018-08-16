/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');
const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + '/siteConfig.js');

function imgUrl(img) {
  return siteConfig.baseUrl + 'img/' + img;
}

function docUrl(doc, language) {
  return siteConfig.baseUrl + 'docs/' + (language ? language + '/' : '') + doc;
}

function pageUrl(page, language) {
  return siteConfig.baseUrl + (language ? language + '/' : '') + page;
}

class Button extends React.Component {
  render() {
    return (
      <a className="button" href={this.props.href} target={this.props.target}>
        {this.props.children}
      </a>
    );
  }
}

Button.defaultProps = {
  target: '_self'
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="wrapper homeWrapper">{props.children}</div>
  </div>
);

const Logo = props => (
  <div className="projectLogo">
    <img src={props.img_src} />
  </div>
);

const ProjectTitle = props => <h2 className="projectTitle">{siteConfig.tagline}</h2>;

const PromoSection = props => (
  <div className="section">
    <div className="promoRow">{props.children}</div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    let language = this.props.language || '';
    return (
      <SplashContainer>
        <PromoSection>
          <img src="img/LOGO_ThingsPro_r.png" id="landing-logo" alt="ThingsPro" />
          <ProjectTitle />
          <Button href="docs/edge/intro">Getting Started</Button>
          <p className="landing-link">
            <small>
              You can fill out the form to try out ThingsPro. <a href=".">Try out now!</a>
            </small>
          </p>
        </PromoSection>
      </SplashContainer>
    );
  }
}

const Block = props => (
  <Container id={props.id} background={props.background}>
    <GridBlock align="center" contents={props.children} layout={props.layout} />
  </Container>
);

const Features = props => (
  <Container className="features-section">
    <h2>Key features of ThingsPro</h2>
    <Block layout="threeColumn">
      {[
        {
          title: 'Manage industrial IoT devices',
          content: '',
          image: imgUrl('features01.svg'),
          imageAlign: 'top',
          imageAlt: ''
        },
        {
          title: 'Create App to connect devices',
          content: '',
          image: imgUrl('features02.svg'),
          imageAlign: 'top',
          imageAlt: ''
        },
        {
          title: 'Experience customized ThingsPro',
          content: '',
          image: imgUrl('features03.svg'),
          imageAlign: 'top',
          imageAlt: ''
        }
      ]}
    </Block>
  </Container>
);

const TryOut = props => (
  <Container className="try-out-section">
    <div className="img-block">
      <img src="./img/19678105_retouch1-exp2_mrg.png" alt="try it out" />
    </div>
    <div className="text-block">
      <h2>Try it out</h2>
      <p>
        Apply for an account and try ThingsPro <strong>for free</strong> now!
        <br />
        The trial is full function for you for evaluation. Explore ThingsPro at your own pace and feedback is welcomed.
      </p>
      <div className="button-box">
        <Button href=".">Fill out the Form</Button>
      </div>
    </div>
    <div className="clearfix" />
  </Container>
);

const LastCTA = props => (
  <Container className="last-cta-section">
    <h2>Getting started with developer document</h2>
    {/* <p className="text-max-width">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius, praesentium. Temporibus eius necessitatibus odio vero dicta magni quasi commodi consequatur.</p> */}
    <div className="button-box">
      <Button href="docs/edge/intro">Edge Docs</Button>
      <Button href="docs/ui/intro">App UI Docs</Button>
    </div>
  </Container>
);

const Showcase = props => {
  if ((siteConfig.users || []).length === 0) {
    return null;
  }
  const showcase = siteConfig.users
    .filter(user => {
      return user.pinned;
    })
    .map((user, i) => {
      return (
        <a href={user.infoLink} key={i}>
          <img src={user.image} alt={user.caption} title={user.caption} />
        </a>
      );
    });

  return (
    <div className="productShowcaseSection paddingBottom">
      <h2>{"Who's Using This?"}</h2>
      <p>This project is used by all these people</p>
      <div className="logos">{showcase}</div>
      <div className="more-users">
        <a className="button" href={pageUrl('users.html', props.language)}>
          More {siteConfig.title} Users
        </a>
      </div>
    </div>
  );
};

class Index extends React.Component {
  render() {
    let language = this.props.language || '';

    return (
      <div>
        <HomeSplash language={language} />
        <div className="">
          <Features />
          <TryOut />
          <LastCTA />
          <Showcase language={language} />
        </div>
      </div>
    );
  }
}

module.exports = Index;
