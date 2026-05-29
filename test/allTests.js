import { expect } from 'chai';
import setup from '../src/index';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

setup();

function makeClassComponent({ addClickHandler, displayName }) {
  const onClick = addClickHandler ? () => {} : undefined;

  class GeneratedComponent extends Component {
    static displayName = displayName;
    constructor(props) {
      super(props);
      this.buttonRef = createRef();
    }

    componentDidMount() {
      this.buttonRef.current.click();
    }

    render() {
      return <div ref={this.buttonRef} onClick={onClick} />;
    }
  }

  return GeneratedComponent;
}

function clickableDiv(props) {
  const ref = useCallback((element) => {
    if (element) element.click();
  });
  return <div {...props} ref={ref} />;
}

function makeFunctionComponent( name, displayName ) {
  // we can get the function to use the provided name by mounting it onto an
  // object first
  const mountedComponent = {
    [name](props) {
      return clickableDiv(props);
    },
  };
  const GeneratedComponent = mountedComponent[name];

  if (displayName) {
    GeneratedComponent.displayName = displayName;
  }

  return GeneratedComponent;
}

const WithClickHandler = makeClassComponent({
  addClickHandler: true,
  displayName: 'WithClickHandler',
});
const NoClickHandler = makeClassComponent({
  addClickHandler: false,
  displayName: 'NoClickHandler',
});

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

const FunctionComponentWithoutDisplayName = makeFunctionComponent(
  'FunctionComponentWithoutDisplayName',
);

// specify both name and displayName here so that we can validate our
// preference for the latter
const FunctionComponentWithDisplayName = makeFunctionComponent(
  'FunctionComponentWithDisplayName', 'FCWithDisplayName'
);

describe('logrocket-react', () => {
  let clickEvents;
  let root;

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

  describe('given a function component', function () {
    describe('without a display name', function () {
      it('it reports the function name instead', function () {
        render(<FunctionComponentWithoutDisplayName />);
        expect(clickEvents).toHaveLength(1);
        expect(clickEvents[0].__lrName).toEqual([
          'FunctionComponentWithoutDisplayName',
        ]);
      });
    });
    describe('with a display name', function () {
      it('it reports the display name', function () {
        render(<FunctionComponentWithDisplayName />);
        expect(clickEvents).toHaveLength(1);
        expect(clickEvents[0].__lrName).toEqual(['FCWithDisplayName']);
      });
    });
  });
});
