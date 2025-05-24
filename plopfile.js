import inquirerDirectory from 'inquirer-directory';

export default function (plop) {
  plop.setPrompt('directory', inquirerDirectory);

  plop.setGenerator('component', {
    description: 'Generate a React component folder with a loadable file and a component file',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name (e.g. Button)',
      },
      {
        type: 'directory',
        name: 'path',
        message: 'Select directory',
        basePath: './src',
      },
      {
        type: 'confirm',
        name: 'useMemo',
        message:
          'Do you want to wrap your component in React.memo? (Note: React 19 has automatic optimization, so memo might not be needed)',
        default: false,
      },
      {
        type: 'confirm',
        name: 'useStyled',
        message: 'Do you want to use styled-components?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'useTests',
        message: 'Do you want to have tests?',
        default: false,
      },
    ],
    actions: data => {
      const targetPath = data.path.startsWith('src/') ? data.path : `src/${data.path}`;
      const actions = [];

      // Add component file
      actions.push({
        type: 'add',
        path: `${targetPath}/{{pascalCase name}}/index.tsx`,
        template: `/**
 *
 * {{pascalCase name}}
 *
 */
import React{{#if useMemo}}, { memo }{{/if}} from 'react';
{{#if useStyled}}import styled from 'styled-components/macro';\n{{/if}}

interface Props {}

export const {{pascalCase name}} = {{#if useMemo}}memo({{/if}}(props: Props) => {
  return {{#if useStyled}}<Div>{{/if}}{{#unless useStyled}}<div>{{/unless}}{{pascalCase name}} component{{#if useStyled}}</Div>{{/if}}{{#unless useStyled}}</div>{{/unless}};
}{{#if useMemo}}){{/if}};

{{#if useStyled}}
const Div = styled.div\`\`;
{{/if}}`,
      });

      // Add loadable file
      actions.push({
        type: 'add',
        path: `${targetPath}/{{pascalCase name}}/loadable.ts`,
        template: `/**
 *
 * Asynchronously loads the component for {{pascalCase name}}
 *
 */

import { lazyLoad } from '@/utils/loadable';

export const {{pascalCase name}} = lazyLoad(
  () => import('./index'),
  module => module.{{pascalCase name}},
);`,
      });

      // Add test file if tests are enabled
      if (data.useTests) {
        actions.push({
          type: 'add',
          path: `${targetPath}/{{pascalCase name}}/{{pascalCase name}}.test.tsx`,
          template: `import { render, screen } from '@testing-library/react';
import {{pascalCase name}} from './{{pascalCase name}}';

describe('{{pascalCase name}}', () => {
  it('renders correctly', () => {
    render(<{{pascalCase name}} />);
    expect(screen.getByText('{{pascalCase name}} component')).toBeInTheDocument();
  });
});`,
        });
      }

      return actions;
    },
  });
}
