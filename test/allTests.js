import { expect } from 'chai';
import setup from '../index';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

setup();

class WithClickHandler extends Component {
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

class NoClickHandler extends Component {
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
    render(<WithClickHandler />, root);
    expect(clickEvents).to.have.length(1);
    expect(clickEvents[0].__lrName).to.eql(['WithClickHandler']);
  });

  it('should log the full hierarchy of components', () => {
    render(<NestedD />, root);
    expect(clickEvents).to.have.length(1);
    expect(clickEvents[0].__lrName).to.eql([
      'WithClickHandler', 'NestedA', 'NestedB', 'NestedC', 'NestedE', 'foobar',
    ]);
  });

  it('should log when there is no click handler', () => {
    render(<NoClickHandler />, root);
    expect(clickEvents).to.have.length(1);
    expect(clickEvents[0].__lrName).to.eql(['NoClickHandler']);
  });
});
