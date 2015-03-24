angular.module('blog.types', [])
    .factory('blogTypesLoader', function () {
        return function () {
            return [
                {code: 'blog', label: 'Blog'}
            ];
        }
    });