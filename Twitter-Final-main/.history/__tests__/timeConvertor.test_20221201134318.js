import React from 'react'
import {timeConverter} from "../util/util";



describe('timeConvertor', () => {
    it('convert unix base time to date', () => {
        const seconds = 1669688658
        const result = timeConverter(seconds)
        expect(result).toBe('25 Nov 2022')

    })
})
