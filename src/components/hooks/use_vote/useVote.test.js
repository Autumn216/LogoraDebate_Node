import { renderHook, act } from "@testing-library/react-hooks";
import { useVote } from "@logora/debate.hooks.use_vote";
import { useAuth } from "@logora/debate.auth.use_auth";
import { useAuthenticationRequired } from "@logora/debate.hooks.use_authentication_required";
import { VoteContext } from "@logora/debate.vote.vote_provider";
import React from "react";

const voteContextMock = {
  votes: {
    123: { id: "789", is_upvote: true },
  },
  addVoteableIds: jest.fn(),
};

const wrapper = ({ children }) => (
  <VoteContext.Provider value={voteContextMock}>
    {children}
  </VoteContext.Provider>
);

jest.mock("@logora/debate.auth.use_auth", () => ({
  useAuth: jest.fn(() => ({ isLoggedIn: true })),
}));

jest.mock("@logora/debate.data.data_provider", () => ({
  useDataProvider: jest.fn(() => ({
    create: jest.fn(() =>
      Promise.resolve({
        data: { success: true, data: { resource: { id: "456" } } },
      })
    ),
    update: jest.fn(() => Promise.resolve({ data: { success: true } })),
    delete: jest.fn(() => Promise.resolve({ data: { success: true } })),
  })),
}));

jest.mock("@logora/debate.hooks.use_authentication_required");

describe("useVote", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ isLoggedIn: true });
    useAuthenticationRequired.mockReturnValue(jest.fn());
  });

  it("voteId should be defined after a vote", () => {
    const { result } = renderHook(
      () => useVote("article", "123", 0, 0, () => {}),
      { wrapper }
    );
    // On déclenche un vote
    act(() => {
      result.current.handleVote(true);
    });

    console.log("voteId", result.current);
    // On s'attend à ce que voteId soit défini
  });

  it("should handle upvote correctly", async () => {
    const onVoteMock = jest.fn();

    const { result, waitForNextUpdate } = renderHook(
      () => useVote("article", "123", 5, 2, onVoteMock),
      { wrapper }
    );

    act(() => {
      result.current.handleVote(true);
    });

    await waitForNextUpdate();

    expect(result.current.totalUpvotes).toBe(4);
    expect(result.current.totalDownvotes).toBe(2);
    expect(result.current.voteSide).toBe(true);
  });

  it("should handle downvote correctly", async () => {
    const onVoteMock = jest.fn();

    const { result, waitForNextUpdate } = renderHook(
      () => useVote("article", "123", 5, 2, onVoteMock),
      { wrapper }
    );

    act(() => {
      result.current.handleVote(false);
    });

    await waitForNextUpdate();

    expect(result.current.totalUpvotes).toBe(4);
    expect(result.current.totalDownvotes).toBe(3);
    expect(result.current.activeVote).toBe(true);
    expect(result.current.voteSide).toBe(false);
    expect(onVoteMock).toHaveBeenCalledWith(false);
  });

  it("should update upvote and then downvote correctly", async () => {
    const onVoteMock = jest.fn();

    const { result, waitForNextUpdate } = renderHook(
      () => useVote("article", "123", 5, 2, onVoteMock),
      { wrapper }
    );

    act(() => {
      result.current.handleVote(true);
      result.current.handleVote(false);
    });

    await waitForNextUpdate();
    expect(result.current.totalUpvotes).toBe(4);
    expect(result.current.totalDownvotes).toBe(3);
    expect(result.current.voteSide).toBe(false);
  });

  it("should update upvote and then upvote again correctly", async () => {
    const onVoteMock = jest.fn();

    const { result, waitForNextUpdate } = renderHook(
      () => useVote("article", "123", 5, 2, onVoteMock),
      { wrapper }
    );

    act(async () => {
      await result.current.handleVote(true);
      await result.current.handleVote(true);
    });

    await waitForNextUpdate();
    expect(result.current.totalUpvotes).toBe(5);
    expect(result.current.totalDownvotes).toBe(2);
    expect(result.current.voteSide).toBe(true);
  });
});
