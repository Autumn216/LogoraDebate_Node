import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { ArgumentBlankBox } from './ArgumentBlankBox';
import { faker } from '@faker-js/faker';

const position = {
    id: 18,
    name: faker.lorem.word()
}
  
const debateUrl = faker.internet.url();

describe('ArgumentBlankBox', () => {
  const handleClick = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the element with the right default props', () => {

    render(
        <IntlProvider locale="en">
            <ArgumentBlankBox
                debateUrl={debateUrl}
                position={position}
            />
        </IntlProvider>
    );

    expect(screen.getByText('Add an argument')).toBeDefined();
    expect(screen.getByText(position.name)).toBeDefined();
    expect(screen.getByText(position.name)).toHaveTextContent(position.name);

    const link = screen.getByRole('link');
    expect(link.href).toBe(debateUrl + "/?initArgument=true&positionId=" + position.id);
  });

  it('should invoke the handleClick prop', () => {
    render(
        <IntlProvider locale="en">
            <ArgumentBlankBox
                position={position}
                handleClick={handleClick}
            />
        </IntlProvider>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});