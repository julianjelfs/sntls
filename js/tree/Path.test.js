/*global sntls, module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, raises */
(function () {
    "use strict";

    module("Path");

    test("Initialized by string", function () {
        var path;

        path = sntls.Path.create('test>path>it>is');
        deepEqual(path.asArray, ['test', 'path', 'it', 'is'], "Array representation");

        path = sntls.Path.create('te%3Est>path>it>is');
        deepEqual(path.asArray, ['te>st', 'path', 'it', 'is'], "Array representation w/ encode");
    });

    test("Initialized by array", function () {
        var path = sntls.Path.create(['test', 'path', 'it', 'is']);
        deepEqual(path.asArray, ['test', 'path', 'it', 'is'], "Array representation");
    });

    test("Key retrieval", function () {
        var path = sntls.Path.create('test>path>it>is');
        equal(path.getLastKey(), 'is', "Last key");
    });

    test("Serialization", function () {
        var path;

        path = sntls.Path.create(['test', 'path', 'it', 'is']);
        equal(path.toString(), 'test>path>it>is', "Serialized path");

        path = sntls.Path.create(['test>', 'path', 'it', 'is']);
        equal(path.toString(), 'test%3E>path>it>is', "Serialized path");
    });

    test("Cloning", function () {
        var path = sntls.Path.create('test>path>it>is'),
            clonePath = path.clone();

        deepEqual(path.asArray, clonePath.asArray, "Path buffers represent the same path");
        notStrictEqual(path, clonePath, "Clone is different from original");
        notStrictEqual(path.asArray, clonePath.asArray, "Clone's buffer is different from original");
    });

    test("Left trimming", function () {
        var originalPath = sntls.Path.create(['test', 'originalPath', 'it', 'is']),
            trimmedPath = originalPath.trimLeft();

        strictEqual(originalPath, trimmedPath, "Trimming returns new Path");
        deepEqual(
            trimmedPath.asArray,
            ['originalPath', 'it', 'is'],
            "Trimmed path"
        );

        originalPath.trimLeft(2);
        deepEqual(
            originalPath.asArray,
            ['is'],
            "Trimmed multiple keys"
        );
    });

    test("Right trimming", function () {
        var originalPath = sntls.Path.create(['test', 'originalPath', 'it', 'is']),
            trimmedPath = originalPath.trimRight();

        strictEqual(originalPath, trimmedPath, "Trimming returns new Path");
        deepEqual(
            trimmedPath.asArray,
            ['test', 'originalPath', 'it'],
            "Trimmed path"
        );

        originalPath.trimRight(2);
        deepEqual(
            originalPath.asArray,
            ['test'],
            "Trimmed multiple keys"
        );
    });

    test("Appending", function () {
        var originalPath = sntls.Path.create(['test', 'originalPath', 'it', 'is']),
            appendedPath = originalPath.append('foo>bar'.toPath());

        strictEqual(originalPath, appendedPath, "Appending returns new Path");

        deepEqual(
            appendedPath.asArray,
            ['test', 'originalPath', 'it', 'is', 'foo', 'bar'],
            "Appended path"
        );
    });

    test("Appending key", function () {
        var originalPath = sntls.Path.create(['test', 'originalPath', 'it', 'is']),
            appendedPath = originalPath.appendKey('foo');

        strictEqual(originalPath, appendedPath, "Appending returns new Path");

        deepEqual(
            appendedPath.asArray,
            ['test', 'originalPath', 'it', 'is', 'foo'],
            "Appended path"
        );
    });

    test("Prepending", function () {
        var originalPath = sntls.Path.create(['test', 'originalPath', 'it', 'is']),
            prependedPath = originalPath.prepend('foo>bar'.toPath());

        strictEqual(originalPath, prependedPath, "Prepending returns new Path");

        deepEqual(
            prependedPath.asArray,
            ['foo', 'bar', 'test', 'originalPath', 'it', 'is'],
            "Prepended path"
        );
    });

    test("Prepending key", function () {
        var originalPath = sntls.Path.create(['test', 'originalPath', 'it', 'is']),
            prependedPath = originalPath.prependKey('foo');

        strictEqual(originalPath, prependedPath, "Prepending returns new Path");

        deepEqual(
            prependedPath.asArray,
            ['foo', 'test', 'originalPath', 'it', 'is'],
            "Prepended path"
        );
    });

    test("Equality", function () {
        /** @type sntls.Path */
        var path = sntls.Path.create('test>path>it>is');

        ok(!path.equals(), "Not equal to undefined");
        ok(!path.equals("string"), "Not equal to string");

        ok(path.equals(sntls.Path.create('test>path>it>is')), "Matching path");
        ok(!path.equals(sntls.Path.create('path>it>is')), "Non-matching path");

        ok(path.equals('test>path>it>is'.toPath()), "Matching string path");
        ok(!path.equals('path>it>is'.toPath()), "Non-matching string path");

        ok(path.equals(['test', 'path', 'it', 'is'].toPath()), "Matching array path");
        ok(!path.equals(['path', 'it', 'is'].toPath()), "Non-matching array path");
    });

    test("Relative paths", function () {
        var root = sntls.Path.create('test>path'),
            path = sntls.Path.create('test>path>it>is');

        ok(path.isRelativeTo(root), "Path is relative to root");
        ok(root.isRelativeTo(root.clone()), "Root is relative to itself");
        ok(!root.isRelativeTo(path), "Root is not relative to path");
    });

    test("Root paths", function () {
        var root = sntls.Path.create('test>path'),
            path = sntls.Path.create('test>path>it>is');

        ok(root.isRootOf(root), "Path is root of itself");
        ok(root.isRootOf(path), "Path is root of relative path");
        ok(!path.isRootOf(root), "Path is not root of paths it's relative to");
    });

    test("String conversion", function () {
        var path = 'test>path>hello>world'.toPath();

        ok(sntls.Path.isBaseOf(path), "Path type");
        deepEqual(path.asArray, ['test', 'path', 'hello', 'world'], "Path contents");
    });

    test("Array conversion", function () {
        var path = ['test', 'path', 'hello', 'world'].toPath();

        ok(sntls.Path.isBaseOf(path), "Path type");
        deepEqual(path.asArray, ['test', 'path', 'hello', 'world'], "Path contents");
    });
}());
