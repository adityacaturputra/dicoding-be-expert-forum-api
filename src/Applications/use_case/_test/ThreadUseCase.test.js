/* eslint-disable max-len */
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadUseCase = require('../ThreadUseCase');

describe('ThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'NewThread Title',
      body: 'NewThread body',
    };
    const fakeOwner = 'user-123';
    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: fakeOwner,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn(() => Promise.resolve(expectedAddedThread));

    /** creating use case instance */
    const threadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await threadUseCase.addThread(useCasePayload, fakeOwner);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }), fakeOwner);
  });

  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const fakeThread = 'thread-123';
    const expectedDetailThread = new DetailThread({
      id: 'thread-123',
      title: 'NewThread Title',
      body: 'NewThread body',
      date: '2022-04-07T11:08:35+0000',
      username: 'dicoding',
    });
    const expectedDetailComment = [
      new DetailComment({
        id: 'comment-123',
        username: 'dicoding',
        date: '2022-04-07T11:08:35+0000',
        content: 'NewComment content',
        isDelete: false,
      }),
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(expectedDetailThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(expectedDetailComment));

    /** creating use case instance */
    const threadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    await threadUseCase.getThreadById(fakeThread);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(fakeThread);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(fakeThread);
  });
});
