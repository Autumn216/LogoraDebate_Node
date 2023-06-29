import React from 'react';
import { render, screen, waitForElementToBeRemoved, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DefaultSourceModal } from './SourceModal.composition';
import nock from 'nock';

const addSourceCallback = jest.fn();
const hideModalCallback = jest.fn();

const scope = nock("https://mock.example.api")
    .post("/sources/fetch")
    .reply(201, {
            success: true,
            data: {
                resource: {
                    "id": 79,
                    "uid": "dfe49a73-b421-46b9-8a48-3a570c938889",
                    "title": "My source title",
                    "publisher": "lemonde.fr",
                    "origin_image_url": "https://picsum.photos/536/354",
                    "source_url": "http://lemonde.fr",
                    "published_date": null
                }
            }
        },
        {
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/json'
        }
    )

it('should render modal with content and title', () => {
	const modal = render(
		<DefaultSourceModal />
	);

	expect(screen.getByText("Ajouter une source")).toBeTruthy();
	expect(screen.getByRole("input")).toBeTruthy();
	expect(document.body.style.overflowY).toEqual("hidden");
});

// it('should trigger addSourceCallback when adding source', async () => {
// 	const modal = render(
// 		<DefaultSourceModal />
// 	);

//     const input = screen.getByRole("input");

//     expect(input).toBeTruthy();

//     await userEvent.type(input, "https://lemonde.fr[Enter]");
//     expect(input.value).toBe("https://lemonde.fr");

//     expect(screen.getByRole("status")).toBeTruthy();

//     const addSourceButton = screen.getByText("Ajouter");
//     expect(addSourceButton).toBeTruthy();
//     userEvent.click(addSourceButton);

//     expect(addSourceCallback).toHaveBeenCalledTimes(1);
// 	expect(screen.queryByText("Ajouter une source")).toBeFalsy();
// 	expect(document.body.style.overflowY).toEqual("hidden");
// });

it('should close modal on click outside', async() => {
	const modal = render(
		<DefaultSourceModal />
	);

	expect(screen.getByText("Ajouter une source")).toBeTruthy();
	expect(document.body.style.overflowY).toEqual("hidden")

    expect(document.body.style.overflowY).toEqual("hidden")
	await userEvent.click(document.body)

	waitForElementToBeRemoved(screen.getByText("Ajouter une source")).then(() =>
		expect(screen.queryByRole("dialog")).toBeNull()
	)
});

// it('should trigger onHideModal callback on close modal', async() => {
// 	const modal = render(
//         <ModalProvider>
//             <IntlProvider locale="en">
//                 <DataProviderContext.Provider value={{ dataProvider: data }}>
//                     <SourceModal 
//                         onAddSource={addSourceCallback} 
//                         onHideModal={hideModalCallback} 
//                         sources={[]}
//                     />
//                 </DataProviderContext.Provider>
//             </IntlProvider>
//         </ModalProvider>
//     );

//     const submitButton = screen.getByText("Rechercher");
//     const input = screen.getByRole("input");

//     expect(submitButton).toBeTruthy();
//     expect(input).toBeTruthy();

//     await userEvent.click(input);
//     await userEvent.keyboard("http://lemonde.fr");
//     expect(input.value).toBe("http://lemonde.fr");
    
//     await userEvent.click(submitButton);

//     await waitFor(() => {
//         expect(screen.getByRole("status")).toBeTruthy();
//     });

//     await waitFor(() => {
//         const addSourceButton = screen.getByText("Ajouter")
//         userEvent.click(addSourceButton);
//     });

//     expect(hideModalCallback).toHaveBeenCalledTimes(1);
//     expect(screen.getByText("Ajouter une source")).toBeFalsy()
// });