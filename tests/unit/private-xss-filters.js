/*
Copyright (c) 2015, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.

Authors: Nera Liu <neraliu@yahoo-inc.com>
         Adonis Fung <adon@yahoo-inc.com>
         Albert Yu <albertyu@yahoo-inc.com>
*/
/* jshint multistr:true */
(function() {

    require("mocha");

    var expect = require('expect.js');
    var filter = require('../../src/xss-filters')._privFilters;
    var testutils = require('../utils.js');

    describe("private-xss-filters: existence tests", function() {
        it('filter y exists', function() {
            expect(filter.y).to.be.ok();
        });
        it('filter yd exists', function() {
            expect(filter.yd).to.be.ok();
        });
        it('filter yc exists', function() {
            expect(filter.yc).to.be.ok();
        });
        it('filter yavd exists', function() {
            expect(filter.yavd).to.be.ok();
        });
        it('filter yavs exists', function() {
            expect(filter.yavs).to.be.ok();
        });
        it('filter yavu exists', function() {
            expect(filter.yavu).to.be.ok();
        });
        it('filter yu exists', function() {
            expect(filter.yu).to.be.ok();
        });
        it('filter yuc exists', function() {
            expect(filter.yuc).to.be.ok();
        });
        it('filter yubl exists', function() {
            expect(filter.yubl).to.be.ok();
        });
        it('filter yufull exists', function() {
            expect(filter.yufull).to.be.ok();
        });
    });

    describe("private-xss-filters: alias tests", function() {
        it('filter yu being an alias of encodeURI', function() {
            expect(filter.yu).to.eql(encodeURI);
        });

        it('filter yuc being an alias of encodeURIComponent', function() {
            expect(filter.yuc).to.eql(encodeURIComponent);
        });
    });

    describe("private-xss-filters: encodeURI() and encodeURIComponent() tests", function() {
        it('percentage encoded ASCII chars of decimal 0-32 chars', function() {
            var chars = [
                    '\u0000',
                    '\u0001', '\u0002', '\u0003', '\u0004', 
                    '\u0005', '\u0006', '\u0007', '\u0008', 
                    '\u0009', '\u000A', '\u000B', '\u000C', 
                    '\u000D', '\u000E', '\u000F', '\u0010', 
                    '\u0011', '\u0012', '\u0013', '\u0014', 
                    '\u0015', '\u0016', '\u0017', '\u0018', 
                    '\u0019', '\u001A', '\u001B', '\u001C', 
                    '\u001D', '\u001E', '\u001F', '\u0020'],
                percentEncoded = [
                    "%00",
                    "%01", "%02", "%03", "%04", 
                    "%05", "%06", "%07", "%08", 
                    "%09", "%0A", "%0B", "%0C", 
                    "%0D", "%0E", "%0F", "%10", 
                    "%11", "%12", "%13", "%14", 
                    "%15", "%16", "%17", "%18", 
                    "%19", "%1A", "%1B", "%1C", 
                    "%1D", "%1E", "%1F", "%20"];

            expect(chars.map(encodeURI)).to.eql(percentEncoded);
            expect(chars.map(encodeURIComponent)).to.eql(percentEncoded);
        });
    });

    describe("private-xss-filters: error and data type tests", function() {

        // an feature indicator of which encodeURI() and encodeURIComponent is used
        it('filter yuc and yu throw URI malformed', function() {
            expect(function() { filter.yu('foo\uD800'); }).to.throwError(/URI malformed/);
            expect(function() { filter.yuc('foo\uD800'); }).to.throwError(/URI malformed/);
        });

        it('filters handling of undefined input', function() {
            expect(filter.y()).to.eql('undefined');
            expect(filter.yd()).to.eql('undefined');
            expect(filter.yc()).to.eql('undefined');

            expect(filter.yavd()).to.eql('undefined');
            expect(filter.yavs()).to.eql('undefined');
            expect(filter.yavu()).to.eql('undefined');

            expect(filter.yu()).to.eql('undefined');
            expect(filter.yuc()).to.eql('undefined');
            // yubl will not be independently used
            // expect(filter.yubl()).to.eql('undefined');
        });

        it('filters handling of null input', function() {
            expect(filter.y(null)).to.eql('null');
            expect(filter.yd(null)).to.eql('null');
            expect(filter.yc(null)).to.eql('null');

            expect(filter.yavd(null)).to.eql('null');
            expect(filter.yavs(null)).to.eql('null');
            expect(filter.yavu(null)).to.eql('null');

            expect(filter.yu(null)).to.eql('null');
            expect(filter.yuc(null)).to.eql('null');
            // yubl will not be independently used
            // expect(filter.yubl()).to.eql('undefined');
        });


        it('filters handling of array input', function() {
            var array = ['a', 'b'], result = 'a,b';

            expect(filter.y(array)).to.eql(result);
            expect(filter.yd(array)).to.eql(result);
            expect(filter.yc(array)).to.eql(result);

            expect(filter.yavd(array)).to.eql(result);
            expect(filter.yavs(array)).to.eql(result);
            expect(filter.yavu(array)).to.eql(result);

            expect(filter.yu(array)).to.eql(result);
            expect(filter.yuc(array)).to.eql('a%2Cb');
            // yubl will not be independently used
            // expect(filter.yubl()).to.eql('undefined');
        });


        it('filters handling of object input', function() {
            var object = {'a':1, 'b':0}, result = '[object Object]';

            expect(filter.y(object)).to.eql(result);
            expect(filter.yd(object)).to.eql(result);
            expect(filter.yc(object)).to.eql(result + ' ');

            expect(filter.yavd(object)).to.eql(result);
            expect(filter.yavs(object)).to.eql(result);
            expect(filter.yavu(object)).to.eql('[object&#32;Object]');

            expect(filter.yu(object)).to.eql('%5Bobject%20Object%5D');
            expect(filter.yuc(object)).to.eql('%5Bobject%20Object%5D');
            // yubl will not be independently used
            // expect(filter.yubl()).to.eql('undefined');
        });

        it('filters handling of empty string', function() {
            var str = '', result = '';

            expect(filter.y(str)).to.eql(result);
            expect(filter.yd(str)).to.eql(result);
            expect(filter.yc(str)).to.eql(result);

            expect(filter.yavd(str)).to.eql(result);
            expect(filter.yavs(str)).to.eql(result);
            expect(filter.yavu(str)).to.eql('\uFFFD');

            expect(filter.yu(str)).to.eql(result);
            expect(filter.yuc(str)).to.eql(result);
            expect(filter.yubl(str)).to.eql(result);
        });
    });

    describe("private-xss-filters: unchained state transition tests", function() {
        
        it('filter y state transition test', function() {
            var s = "foo&<>\"'` bar&<>\"' &lt;";
            var o = filter.y(s);
            expect(o).to.eql('foo&amp;&lt;&gt;&quot;&#39;&#96; bar&amp;&lt;&gt;&quot;&#39; &amp;lt;');
        });

        it('filter yd state transition test', function() {
            testutils.test_yd(filter.yd, ['foo&&lt;>\'"']);
        });

        it('filter yc state transition test', function() {
            testutils.test_yc(filter.yc, [
                '-- > --! > <!--[if IE] ><script>alert("yahoo\'s filters")</script>', 
                'foo-- ', 
                'foo--! ', 
                '[if IE] ', 
                'foo- ', 
                'foo- ',
                ' ><script>alert(1)</script>',
                '---------- ><script>alert(1)</script>',
                '--\uFFFD>']);
        });

        it('filter yav-single-quoted state transition test', function() {
            testutils.test_yav(filter.yavs, [
                'foo&<>&#39;"` \t\n\v\f\r', '\f', '',
                '&#39;&#39;', ' &#39;&#39;', '\t&#39;&#39;', '\n&#39;&#39;', '\f&#39;&#39;',
                '""',         ' ""',         '\t""',         '\n""',         '\f""',
                '``',         ' ``',         '\t``',         '\n``',         '\f``']);
        });

        it('filter yav-double-quoted state transition test', function() {
            testutils.test_yav(filter.yavd, [
                'foo&<>\'&quot;` \t\n\v\f\r', '\f', '',
                "''",           " ''",           "\t''",           "\n''",           "\f''", 
                '&quot;&quot;', ' &quot;&quot;', '\t&quot;&quot;', '\n&quot;&quot;', '\f&quot;&quot;',
                '``',           ' ``',           '\t``',           '\n``',           '\f``']);
        });
        
        it('filter yav-unquoted state transition test', function() {
            testutils.test_yav(filter.yavu, [
                'foo&<&gt;\'"`&#32;&#9;&#10;&#11;&#12;&#13;', '&#12;', '\uFFFD',
                "&#39;'",  "&#32;''", "&#9;''", "&#10;''", "&#12;''",
                '&quot;"', '&#32;""', '&#9;""', '&#10;""', '&#12;""',
                '&#96;`',  '&#32;``', '&#9;``', '&#10;``', '&#12;``']);
        });

        it('filter yu state transition test', function() {
            testutils.test_yu(filter.yu);
        });

        it('filter yuc state transition test', function() {
            testutils.test_yuc(filter.yuc);
        });

        it('filter yubl state transition test', function() {
            // it is known that yubl, when used independently is vulnerable to attack
            testutils.test_yubl(filter.yubl, [
                'x-\u0001\u0002\u0003\u0004\u0005\u0006\u0007\u0008\u0009\
\u000A\u000B\u000C\u000D\u000E\u000F\u0010\u0011\u0012\
\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001A\u001B\
\u001C\u001D\u001E\u001F\u0020j\nav&#x61;\rscript\t&col\u0000on;'
            ]);

        });

        it('filter yufull state transition test', function() {
            testutils.test_yufull(filter.yufull, ['http://[2001:0db8:85a3:0000:0000:8a2e:0370:7334]']);
        });
        
    });

    describe("private-xss-filters: css expression tests", function() {

        var testPatterns = [ undefined, null,
            '&',
            '1.1', '10%', '+10px', '-10px', '#fff', 
            '\uD7FF', '\uD800', '\uDFFF', '\u1234567',
            '\u0000', ' ', '\r\n\t\f\v', '\\', '\\n\\r\\f\\0\\9\\a\\f',
            '-ide_nt', '"string"', "'string'",
            '- \ _ : ; ( ) " \' / , % # ! * @ . { }', 
            'http://username:password@www.evil.com:8080/?k1=v1&k2=v2#hash',
            'url(https://www.evil.com)', 
            'expression(body.scrollTop + 50 + px)', 
        ];

        it('filter yceu[uds] test', function() {
            var expectedResults = [ 'undefined', 'null',
                '\\26 ',
                '1.1', '10%', '+10px', '-10px', '#fff', 
                '\\d7ff ', '\\d800 ', '\\dfff ', '\\1234 567',
                '\\fffd ', '\\20 ', '\\d \\a \\9 \\c \\b ', '\\5c ', '\\5c n\\5c r\\5c f\\5c 0\\5c 9\\5c a\\5c f',
                '-ide_nt', '\\22 string\\22 ', "\\27 string\\27 ",
                '-\\20 \\20 _\\20 \\3a \\20 \\3b \\20 \\28 \\20 \\29 \\20 \\22 \\20 \\27 \\20 \\2f \\20 \\2c \\20 %\\20 #\\20 \\21 \\20 \\2a \\20 \\40 \\20 .\\20 \\7b \\20 \\7d ', 
                'http\\3a \\2f \\2f username\\3a password\\40 www.evil.com\\3a 8080\\2f \\3f k1\\3d v1\\26 k2\\3d v2#hash',
                'url\\28 https\\3a \\2f \\2f www.evil.com\\29 ',
                'expression\\28 body.scrollTop\\20 +\\20 50\\20 +\\20 px\\29 ',
            ];
            testutils.test_yce(filter.yceu, testPatterns, expectedResults);
        });
        it('filter yced[uds] test', function() {
            var expectedResults = [ 'undefined', 'null',
                '&', 
                '1.1', '10%', '+10px', '-10px', '#fff', 
                '\uD7FF', '\uD800', '\uDFFF', '\u1234567',
                '\uFFFD', ' ', '\\d \\a \\9 \\c \\b ', '\\5c ', '\\5c n\\5c r\\5c f\\5c 0\\5c 9\\5c a\\5c f',
                '-ide_nt', '\\22 string\\22 ', "'string'",
                '-  _ : ; ( ) \\22  \' / , % # ! * @ . { }',
                'http://username:password@www.evil.com:8080/?k1=v1&k2=v2#hash',
                'url(https://www.evil.com)',
                'expression(body.scrollTop + 50 + px)',
            ];
            testutils.test_yce(filter.yced, testPatterns, expectedResults);
        });
        it('filter yces[uds] test', function() {
            var expectedResults = [ 'undefined', 'null',
                '&', 
                '1.1', '10%', '+10px', '-10px', '#fff', 
                '\uD7FF', '\uD800', '\uDFFF', '\u1234567',
                '\uFFFD', ' ', '\\d \\a \\9 \\c \\b ', '\\5c ', '\\5c n\\5c r\\5c f\\5c 0\\5c 9\\5c a\\5c f',
                '-ide_nt', '"string"', "\\27 string\\27 ",
                '-  _ : ; ( ) " \\27  / , % # ! * @ . { }',
                'http://username:password@www.evil.com:8080/?k1=v1&k2=v2#hash',
                'url(https://www.evil.com)',
                'expression(body.scrollTop + 50 + px)',
            ];
            testutils.test_yce(filter.yces, testPatterns, expectedResults);
        });
    });


    describe("private-xss-filters: css url tests", function() {
        var testPatterns = [ undefined, null,
            '&',
            '1.1', '10%', '+10px', '-10px', '#fff', 
            '\\a', '\uD7FF', '\u1234567',
            '\u0000', ' ', '\r\n\t\f\v', '\\', '\\n\\r\\f\\0\\9\\a\\f',
            '-ide_nt', '"string"', "'string'",
            '- \ _ : ; ( ) " \' / , % # ! * @ . { } [ ]', 
            'http://username:password@www.evil.com:8080/?k1=v1&k2=v2#hash',
            '\u0000\u0008\u000b\u007f\u000e-\u001f',
            '&rpar;&#x00029;&#41;&lpar;&#x00028;&#40;&apos;&#x00027;&#39;&quot;&QUOT;&#x00022;&#34',
        ];

        it('filter yceuu[uds] attribute test', function() {
            var expectedResults = [ 'undefined', 'null',
                '&', 
                '1.1', '10%25', '+10px', '-10px', '#fff', 
                '%5Ca', '%ED%9F%BF', '%E1%88%B4567',
                '%EF%BF%BD', '%20', '%0D%0A%09%0C%0B', '%5C', '%5Cn%5Cr%5Cf%5C0%5C9%5Ca%5Cf',
                '-ide_nt', '%22string%22', "\\27 string\\27 ",
                '-%20%20_%20:%20;%20\\28 %20\\29 %20%22%20\\27 %20/%20,%20%25%20#%20!%20*%20@%20.%20%7B%20%7D%20%5B%20%5D',
                'http://username:password@www.evil.com:8080/?k1=v1&k2=v2#hash',
                '%EF%BF%BD%08%0B%7F%0E-%1F',
                '\\29 \\29 \\29 \\28 \\28 \\28 \\27 \\27 \\27 %22%22%22%22',
            ];
            testutils.test_yce(filter.yceuu, testPatterns, expectedResults);
        });
        it('filter yceud[uds] test', function() {
            var expectedResults = [ 'undefined', 'null',
                '&', 
                '1.1', '10%25', '+10px', '-10px', '#fff', 
                '%5Ca', '%ED%9F%BF', '%E1%88%B4567',
                '%EF%BF%BD', '%20', '%0D%0A%09%0C%0B', '%5C', '%5Cn%5Cr%5Cf%5C0%5C9%5Ca%5Cf',
                '-ide_nt', '%22string%22', "'string'",
                '-%20%20_%20:%20;%20(%20)%20%22%20\'%20/%20,%20%25%20#%20!%20*%20@%20.%20%7B%20%7D%20%5B%20%5D',
                'http://username:password@www.evil.com:8080/?k1=v1&k2=v2#hash',
                '%EF%BF%BD%08%0B%7F%0E-%1F',
                ')))(((\'\'\'%22%22%22%22',
            ];
            testutils.test_yce(filter.yceud, testPatterns, expectedResults);
        });
        it('filter yceus[uds] test', function() {
            var expectedResults = [ 'undefined', 'null',
                '&', 
                '1.1', '10%25', '+10px', '-10px', '#fff', 
                '%5Ca', '%ED%9F%BF', '%E1%88%B4567',
                '%EF%BF%BD', '%20', '%0D%0A%09%0C%0B', '%5C', '%5Cn%5Cr%5Cf%5C0%5C9%5Ca%5Cf',
                '-ide_nt', '%22string%22', "\\27 string\\27 ",
                '-%20%20_%20:%20;%20(%20)%20%22%20\\27 %20/%20,%20%25%20#%20!%20*%20@%20.%20%7B%20%7D%20%5B%20%5D',
                'http://username:password@www.evil.com:8080/?k1=v1&k2=v2#hash',
                '%EF%BF%BD%08%0B%7F%0E-%1F',
                ')))(((\\27 \\27 \\27 %22%22%22%22',
            ];
            testutils.test_yce(filter.yceus, testPatterns, expectedResults);
        });
    });

}());
