import React from 'react';
import { render, screen } from '@testing-library/react';
import { ConfigProvider } from '@logora/debate.context.config_provider';
import { IntlProvider } from 'react-intl';
import { AuthorBoxSmall } from './AuthorBoxSmall';
import { Location } from '@logora/debate.util.location';
import { BrowserRouter } from 'react-router-dom';

let UserShowLocation = new Location('espace-debat/user/:userSlug', { userSlug: "" })

const routes = {
  userShowLocation: UserShowLocation,
}

describe('AuthorBoxSmall component', () => {
  const author = {
    full_name: 'John Doe',
    slug: 'john-doe',
    image_url: 'https://example.com/john-doe.jpg',
  };

  test('renders author name, avatar and correct link', () => {
    render(
      <BrowserRouter>
        <ConfigProvider routes={{ ...routes }}>
          <IntlProvider locale="en">
            <AuthorBoxSmall author={author} />
          </IntlProvider>
        </ConfigProvider>
      </BrowserRouter>
    );
    const authorNameElement = screen.getByText(author.full_name);
    expect(authorNameElement).toBeInTheDocument();

    const avatarImageElement = screen.getByRole('img');
    expect(avatarImageElement).toBeInTheDocument();
    expect(avatarImageElement).toHaveAttribute('src', author.image_url);

    const authorLinkElements = screen.getAllByRole('link');
    expect(authorLinkElements.length).toBe(2);
    expect(authorLinkElements[0]).toHaveAttribute(
      'href',
      `/espace-debat/user/${author.slug}`
    );
  });

  test('renders with small avatar size', () => {
    render(
      <BrowserRouter>
        <ConfigProvider routes={{ ...routes }}>
          <IntlProvider locale="en">
            <AuthorBoxSmall author={author} />
          </IntlProvider>
        </ConfigProvider>
      </BrowserRouter>
    );
    const avatarImageElement = screen.getByRole('img');
    expect(avatarImageElement).toHaveAttribute('height', '25');
    expect(avatarImageElement).toHaveAttribute('width', '25');
  });
});
