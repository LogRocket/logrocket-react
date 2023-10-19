import setup from '../index';
import React, { Component } from 'react';
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

class WithClickHandler extends Component {
  componentDidMount() {
    this.refs.button.click();
  }

  render() {
    return <div ref="button" onClick={() => {}} />;
  }
}
WithClickHandler.displayName = 'WithClickHandler';

const NestedA = () => <div><WithClickHandler /></div>;
NestedA.displayName = 'NestedA';
const NestedB = () => <NestedA />;
NestedB.displayName = 'NestedB';
const NestedC = () => (
  <div>
    <NestedB />
  </div>
);
NestedC.displayName = 'NestedC';
const NestedE = ({ children }) => <div>{children}</div>;
NestedE.displayName = 'NestedE';
const NestedD = () => <NestedE><NestedC /></NestedE>;
NestedD.displayName = 'NestedD';
NestedD.displayName = 'foobar';

class NoClickHandler extends Component {
  componentDidMount() {
    this.refs.button.click();
  }

  render() {
    return <div ref="button" />;
  }
}
NoClickHandler.displayName = 'NoClickHandler';

describe('logrocket-react', () => {
  let clickEvents;

  beforeAll(() => {
    setup();

    document.addEventListener('click', e => {
      clickEvents.push(e);
    }, { capture: true, passive: true });
  });

  beforeEach(() => {
    clickEvents = [];
  });

  it('should log a click event with the component', () => {
    render(<WithClickHandler />);
    expect(clickEvents).toHaveLength(1);
    expect(clickEvents[0].__lrName).toEqual(['WithClickHandler']);
  });

  it('should log the full hierarchy of components', () => {
    render(<NestedD />);
    expect(clickEvents).toHaveLength(1);
    expect(clickEvents[0].__lrName).toEqual([
      'WithClickHandler', 'NestedA', 'NestedB', 'NestedC', 'NestedE', 'foobar',
    ]);
  });

  it('should log when there is no click handler', () => {
    render(<NoClickHandler />);
    expect(clickEvents).toHaveLength(1);
    expect(clickEvents[0].__lrName).toEqual(['NoClickHandler']);
  });
});
