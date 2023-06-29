import React from 'react';
import { render } from '@testing-library/react';
import { useRelativeTime } from '@logora/debate.hooks.use_relative_time';
import { ArgumentHeader } from './ArgumentHeader';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from '@logora/debate.context.config_provider';
import { IntlProvider } from 'react-intl';
import { Location } from '@logora/debate.util.location';
import { faker } from '@faker-js/faker';

const author = {
    image_url: 'https://via.placeholder.com/150',
    full_name: 'John Doe',
    slug: 'johndoe',
    last_activity: '2023-04-15T12:00:00Z',
    points: 1234,
    eloquence_title: 'gold',
    occupation: 'Developer'
}

const date = faker.date.past(2);
const tag = faker.name.jobType();

let UserShowLocation = new Location('espace-debat/user/:userSlug', { userSlug: "" })

const routes = {
    userShowLocation: UserShowLocation,
}

describe('ArgumentHeader component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render with correct data', () => {
    const { getByText, getByAltText, getAllByRole } = render(
        <BrowserRouter>
            <ConfigProvider routes={{ ...routes }}>
                <IntlProvider locale="en">
                    <ArgumentHeader author={author} tag={tag} date={date} />
                </IntlProvider>
            </ConfigProvider>
        </BrowserRouter>
    );

    const avatarImg = getByAltText("John Doe's profile picture");
    expect(avatarImg).toBeInTheDocument();
    expect(avatarImg).toHaveAttribute('src', author.image_url);
    expect(getByText('John Doe')).toBeInTheDocument();
    expect(getByText('1.2K')).toBeInTheDocument();
    expect(getByText('Eloquence title')).toBeInTheDocument();
    expect(getByText('Developer')).toBeInTheDocument();
    
    const authorLinkElements = getAllByRole('link');
    expect(authorLinkElements.length).toBe(2);
    expect(authorLinkElements[0]).toHaveAttribute(
        'href',
        `/espace-debat/user/${author.slug}`
    );

    const tagElement = getByText(tag);
    expect(tagElement).toBeInTheDocument();

    const relativeTimeElement = getByText('1 month ago');
    expect(relativeTimeElement).toBeInTheDocument();
  });


  it('should not render tag if not present', () => {
    const { getByText, queryByText } =render(
        <BrowserRouter>
            <ConfigProvider routes={{ ...routes }}>
                <IntlProvider locale="en">
                    <ArgumentHeader author={author} date={date} />
                </IntlProvider>
            </ConfigProvider>
        </BrowserRouter>
    );
    expect(getByText('John Doe')).toBeInTheDocument();
    expect(queryByText(tag)).not.toBeInTheDocument();
  });

  it('should not render date if not present', () => {
    const { getByText, queryByTestId } =render(
        <BrowserRouter>
            <ConfigProvider routes={{ ...routes }}>
                <IntlProvider locale="en">
                    <ArgumentHeader author={author} tag={tag} />
                </IntlProvider>
            </ConfigProvider>
        </BrowserRouter>
    );
    expect(getByText('John Doe')).toBeInTheDocument();
    expect(queryByTestId('argument-header-date')).toBeNull();
  });
  
  it('should not render date if hideDate prop is true', () => {
    const { getByText, queryByTestId } = render(
        <BrowserRouter>
            <ConfigProvider routes={{ ...routes }}>
                <IntlProvider locale="en">
                    <ArgumentHeader author={author} tag={tag} date={date} hideDate />
                </IntlProvider>
            </ConfigProvider>
        </BrowserRouter>
    );
    expect(getByText('John Doe')).toBeInTheDocument();
    expect(queryByTestId('argument-header-date')).toBeNull();
  });

  it('should not render date if hideDate prop is true', () => {
    const { getByText, queryByTestId } = render(
        <BrowserRouter>
            <ConfigProvider routes={{ ...routes }}>
                <IntlProvider locale="en">
                    <ArgumentHeader author={author} tag={tag} date={date} hideDate />
                </IntlProvider>
            </ConfigProvider>
        </BrowserRouter>
    );
    expect(getByText('John Doe')).toBeInTheDocument();
    expect(queryByTestId('argument-header-date')).toBeNull();
  });

  it('should render without links if disabledLinks is true', () => {
    const { getByText, queryByRole } = render(
        <BrowserRouter>
            <ConfigProvider routes={{ ...routes }}>
                <IntlProvider locale="en">
                    <ArgumentHeader author={author} tag={tag} date={date} disableLinks />
                </IntlProvider>
            </ConfigProvider>
        </BrowserRouter>
    );
    expect(getByText('John Doe')).toBeInTheDocument();
    expect(queryByRole('link')).not.toBeInTheDocument();
  });

  it('should render on one line if oneLine is true', () => {
    const { getByText, queryByTestId } = render(
        <BrowserRouter>
            <ConfigProvider routes={{ ...routes }}>
                <IntlProvider locale="en">
                    <ArgumentHeader author={author} tag={tag} date={date} disableLinks />
                </IntlProvider>
            </ConfigProvider>
        </BrowserRouter>
    );
    expect(getByText('John Doe')).toBeInTheDocument();
    expect(getByText(tag)).toBeInTheDocument();
    expect(queryByTestId('argument-header-date')).toBeInTheDocument();
  });
});
