import { expect } from 'chai';
import setup from '../index';
import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';

setup();

class WithClickHandler extends React.Component {
  componentDidMount() {
    this.refs.button.click();
  }

  render() {
    return <div ref="button" onClick={() => {}} />;
  }
}

const NestedA = () => <div><WithClickHandler /></div>;
const NestedB = () => <NestedA />;
const NestedC = () => (
  <div>
    <NestedB />
  </div>
);
const NestedE = ({ children }) => <div>{children}</div>;
const NestedD = () => <NestedE><NestedC /></NestedE>;
NestedD.displayName = 'foobar';

class NoClickHandler extends React.Component {
  componentDidMount() {
    this.refs.button.click();
  }

  render() {
    return <div ref="button" />;
  }
}

describe('logrocket-react', () => {
  let root;
  let clickEvents;

  before(() => {
    document.addEventListener('click', e => {
      clickEvents.push(e);
    }, { capture: true, passive: true });
  });

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);

    clickEvents = [];
  });

  afterEach(() => {
    document.body.removeChild(root);
  });

  it('should log a click event with the component', () => {
    ReactDOM.render(<WithClickHandler />, root);
    expect(clickEvents).to.have.length(1);
    expect(clickEvents[0].__lrName).to.eql(['WithClickHandler']);
  });

  it('should log the full hierarchy of components', () => {
    ReactDOM.render(<NestedD />, root);
    expect(clickEvents).to.have.length(1);
    expect(clickEvents[0].__lrName).to.eql([
      'WithClickHandler', 'NestedA', 'NestedB', 'NestedC', 'foobar',
    ]);
  });

  it('should log when there is no click handler', () => {
    ReactDOM.render(<NoClickHandler />, root);
    expect(clickEvents).to.have.length(1);
    expect(clickEvents[0].__lrName).to.eql(['NoClickHandler']);
  });
});
