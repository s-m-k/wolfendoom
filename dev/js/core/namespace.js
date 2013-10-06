(function (global) {
    var namespace, namespaceParser;

    function createNamespaceParser(context) {
        var parser = function (name) {
            var parts = name.split('/'),
                lastNamespace = context || parser;

            parts.forEach(function (pathPart) {
                lastNamespace = namespace.call(lastNamespace, pathPart);
            });

            return lastNamespace;
        };

        return parser;
    }

    namespaceParser = createNamespaceParser();

    namespace = function (name) {
        var newNamespace = this[name];

        if (!newNamespace) {
            newNamespace = createNamespaceParser();
            this[name] = newNamespace;
        }

        return newNamespace;
    };

    this.wd = this.wd || createNamespaceParser();
}(this));