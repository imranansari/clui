import { ICommand } from '../types';
import { createInput } from '../input';

// COMMAND [SUBCOMMAND] [ARG] [--KEY [VALUE]] [SUBCOMMAND]
it('suggests commands', (done) => {
  const sharedArgs: ICommand['args'] = {
    tag: {
      options: [{ value: 'a' }, { value: 'b' }],
    },
  };

  const root: ICommand = {
    commands: {
      user: {
        commands: {
          post: {
            args: sharedArgs,
            run: () =>
              // handle 'user post --tag a'
              null,

            commands: async (val?: string) => {
              if (!val) {
                return {};
              }

              return {
                [val]: {
                  commands: {
                    preview: {
                      run: () =>
                        // handle 'user post --tag a preview' or 'user post "user input" --tag a preview'
                        null,
                    },
                  },
                  args: sharedArgs,
                  run: () =>
                    // handle 'user post "user input" --tag a'
                    null,
                },
              };
            },
          },
        },
      },
    },
  };
  createInput({
    command: root,
    value: 'user post --tag a preview',
    index: 'user post --tag a preview'.length,
    onUpdate: (updates) => {
      console.log(JSON.stringify(updates.commands, null, 2));
      done();
    },
  });

  createInput({
    command: root,
    value: 'user post "user input" --tag a preview',
    index: 'user post "user input" --tag a preview'.length,
    onUpdate: (updates) => {
      console.log(JSON.stringify(updates.commands, null, 2));
      done();
    },
  });
});
