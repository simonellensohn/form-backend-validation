import { assert } from 'chai';
import Form from '../src/Form';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

let form;
let mockAdapter;

describe('Errors', () => {

    beforeEach(() => {
        form = new Form({
            field1: 'value 1',
            field2: 'value 2',
        });

        mockAdapter = new MockAdapter(axios);
    });

    it('exposes the passed form field values as properties', () => {
        assert.equal(form.field1, 'value 1');
        assert.equal(form.field2, 'value 2');
    });

    it('can reset the form values', () => {
        form.field1 = 'changed';
        form.field2 = 'changed';

        form.reset();

        assert.equal(form.field1, 'value 1');
        assert.equal(form.field2, 'value 2');
    });

    it('can clear the form values', () => {
        form.clear();

        assert.equal(form.field1, '');
        assert.equal(form.field2, '');
    });

    it('will record the errors that the server passes through', async() => {
        mockAdapter.onPost('http://example.com/posts').reply(422, {
            'first_name': ['Value is required'],
        });

        try {
            await form.submit('post', 'http://example.com/posts');
        } catch (e) {} // eslint-disable-line no-empty

        assert.isTrue(form.errors.has('first_name'));
    });

    it('can accept an array with form field names', () => {
        form = new Form(['field1', 'field2']);

        assert.equal(form.data()['field1'], '');
        assert.equal(form.data()['field2'], '');
    });
});