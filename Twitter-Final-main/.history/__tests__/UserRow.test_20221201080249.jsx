import React from 'react'
import {render} from '@testing-library/react'
import UserRow from '../components/userRow'


describe('userRow', () => {
    it('renders a user', () => {

        const user = {
            id:'55555',
            img:'/avatar.png',
            name:'hesan',
            username:'@hesan01'
        }

        const _render = render(<UserRow user={user}/>);

        const text =  _render.getByText('hesan')

        expect(text).toBeInTheDocument()

    })
})
