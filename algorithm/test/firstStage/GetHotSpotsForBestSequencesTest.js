describe("getBestSequencesByHotSpots", function() {
    it("should return empty array if empty given", function() {
        var hotspots = fasta.getHotSpotsForBestSequences({});
        expect(Object.keys(hotspots).length).toEqual(0);
    });

    it("should return hotspots for 1 sequence with only one input sequence", function() {
        var hotspots = fasta.getHotSpotsForBestSequences({'AAA': {'AA': [new fasta.HotSpot(5)]}});
        expect(Object.keys(hotspots).length).toEqual(1);
        expect(Object.keys(hotspots)[0]).toEqual('AAA');
    });

    it("should return hotspots for 1 sequence for 2 input sequences, best one, based on number of hot spots", function() {
        var hotspots = fasta.getHotSpotsForBestSequences(
            {
                'AAB': {
                    'AA': [new fasta.HotSpot(5), new fasta.HotSpot(3)],
                    'AB': [new fasta.HotSpot(2), new fasta.HotSpot(5)]
                },
                'AAC': {
                    'AA': [new fasta.HotSpot(1), new fasta.HotSpot(2)],
                    'AC': [new fasta.HotSpot(3)]
                }
            }
        );
        expect(Object.keys(hotspots).length).toEqual(1);
        expect(Object.keys(hotspots)[0]).toEqual('AAB');
    });

    it("should return hotspots for 2 sequences for 3 input sequences, best ones, based on number of hot spots", function() {
        var hotspots = fasta.getHotSpotsForBestSequences(
            {
                'AAB': {
                    'AA': [new fasta.HotSpot(5), new fasta.HotSpot(5)],
                    'AB': [new fasta.HotSpot(1), new fasta.HotSpot(2)]
                },
                'AAC': {
                    'AA': [new fasta.HotSpot(1), new fasta.HotSpot(2)],
                    'AC': [new fasta.HotSpot(3)]
                },
                'AAD': {
                    'AA': [new fasta.HotSpot(5), new fasta.HotSpot(5)],
                    'AD': [new fasta.HotSpot(5), new fasta.HotSpot(1), new fasta.HotSpot(2)]
                }
            }
        );
        expect(Object.keys(hotspots).length).toEqual(2);
        expect(Object.keys(hotspots)[0]).toEqual('AAD');
        expect(Object.keys(hotspots)[1]).toEqual('AAB');
    });

    it("should return hotspots for 2 sequences for 4 input sequences, best ones, based on number of hot spots", function() {
        var hotspots = fasta.getHotSpotsForBestSequences(
            {
                'AAB': {
                    'AA': [new fasta.HotSpot(5), new fasta.HotSpot(5)],
                    'AB': [new fasta.HotSpot(1), new fasta.HotSpot(2)]
                },
                'AAC': {
                    'AA': [new fasta.HotSpot(1), new fasta.HotSpot(2)],
                    'AC': [new fasta.HotSpot(3)]
                },
                'AAD': {
                    'AA': [new fasta.HotSpot(5), new fasta.HotSpot(5)],
                    'AD': [new fasta.HotSpot(5), new fasta.HotSpot(1), new fasta.HotSpot(2)]
                },
                'AAE': {
                    'AA': [new fasta.HotSpot(1), new fasta.HotSpot(2)]
                }
            }
        );
        expect(Object.keys(hotspots).length).toEqual(2);
        expect(Object.keys(hotspots)[0]).toEqual('AAD');
        expect(Object.keys(hotspots)[1]).toEqual('AAB');
    });

    it("should return hotspots for 2 sequences for 3 input sequences, with random selection for equal sequences", function() {
        var hotspots = fasta.getHotSpotsForBestSequences(
            {
                'AAB': {
                    'AA': [new fasta.HotSpot(5), new fasta.HotSpot(5)],
                    'AB': [new fasta.HotSpot(5), new fasta.HotSpot(1)]
                },
                'AAC': {
                    'AA': [new fasta.HotSpot(5), new fasta.HotSpot(5)],
                    'AC': [new fasta.HotSpot(1)]
                },
                'AAD': {
                    'AA': [new fasta.HotSpot(5), new fasta.HotSpot(5)],
                    'AD': [new fasta.HotSpot(1)]
                }
            }
        );
        expect(Object.keys(hotspots).length).toEqual(2);
        expect(Object.keys(hotspots)[0]).toEqual('AAB');
    });
});
